from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user, AuthenticatedUser, verify_dataset_ownership
from app.core.exceptions import DatasetNotFoundException
from app.schemas.dataset import DatasetCreate, DatasetOut
from app.services.dataset_service import DatasetService

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post("", response_model=Dict[str, Any])
async def create_dataset(
    payload: DatasetCreate,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    dataset = DatasetService.create_dataset(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description
    )
    return dataset


@router.get("", response_model=List[Dict[str, Any]])
async def list_datasets(
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    return DatasetService.list_datasets(user_id=current_user.id)


@router.get("/{dataset_id}", response_model=Dict[str, Any])
async def get_dataset(
    dataset_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    dataset = DatasetService.get_dataset(dataset_id)
    if not dataset:
        raise DatasetNotFoundException(dataset_id)
    # Server-side authorization check (Section 57)
    verify_dataset_ownership(dataset.get("user_id", ""), current_user)
    return dataset
