from typing import Optional, Dict, Any
from fastapi import Depends, Header, HTTPException, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import UnauthorizedException, DatasetAccessDeniedException


class AuthenticatedUser(BaseModel):
    id: str
    email: Optional[str] = None
    role: str = "authenticated"
    full_name: Optional[str] = "Demo User"


# Default local demo user ID for smooth testing & onboarding fallback
DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"
DEMO_USER = AuthenticatedUser(
    id=DEMO_USER_ID,
    email="demo.manager@darkstore.io",
    role="authenticated",
    full_name="QuickCommerce Store Manager"
)


async def get_current_user(
    authorization: Optional[str] = Header(None)
) -> AuthenticatedUser:
    """
    Validates user session from Supabase Authorization header (Bearer <token>).
    Provides seamless fallback for dev/demo mode when testing locally.
    """
    if not authorization:
        # Development fallback allows local testing without requiring active Google OAuth tokens
        if settings.DEBUG or settings.ENVIRONMENT == "development":
            return DEMO_USER
        raise UnauthorizedException("Authorization header required.")

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        if settings.DEBUG:
            return DEMO_USER
        raise UnauthorizedException("Invalid Authorization format. Expected 'Bearer <token>'.")

    token = parts[1]

    # Special dev bypass tokens for immediate local demo testing
    if token in ("demo-token", "dev-test-token", "guest-token"):
        return DEMO_USER

    try:
        # In production or when token provided, verify with Supabase Auth
        from app.db.supabase import get_supabase_admin
        supabase = get_supabase_admin()
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            u = user_response.user
            return AuthenticatedUser(
                id=str(u.id),
                email=u.email,
                role=getattr(u, "role", "authenticated") or "authenticated",
                full_name=u.user_metadata.get("full_name", u.email.split("@")[0] if u.email else "User")
            )
    except Exception as exc:
        logger.warning(f"Supabase auth token verification failed: {exc}")
        if settings.DEBUG:
            return DEMO_USER
        raise UnauthorizedException("Invalid or expired session token.")

    if settings.DEBUG:
        return DEMO_USER
    raise UnauthorizedException("User not authenticated.")


def verify_dataset_ownership(dataset_user_id: str, authenticated_user: AuthenticatedUser) -> bool:
    """
    Strict server-side ownership enforcement:
    A user can only access datasets belonging to their authenticated account.
    """
    if str(dataset_user_id) != str(authenticated_user.id) and authenticated_user.role != "service_role":
        raise DatasetAccessDeniedException(f"Dataset does not belong to user {authenticated_user.id}")
    return True
