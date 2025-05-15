from pydantic import BaseModel
from typing import List, Optional

# Define the model for creating and updating therapists
class TherapistModel(BaseModel):
    name: str
    credentials: str
    specialties: List[str]
    location: str
    languages: List[str]
    insurance: List[str]
    telehealth: bool
    photo: str
    bio: str
    phone_number: Optional[str] 
    website: Optional[str]  
    social_links: Optional[dict]  
    years_of_experience: Optional[int]  
    availability: Optional[str]  

# Define the model for updating therapist details (with optional fields)
class UpdateTherapistModel(BaseModel):
    name: Optional[str]
    credentials: Optional[str]
    specialties: Optional[List[str]]
    location: Optional[str]
    languages: Optional[List[str]]
    insurance: Optional[List[str]]
    telehealth: Optional[bool]
    photo: Optional[str]
    bio: Optional[str]
    phone_number: Optional[str]  
    website: Optional[str]  
    social_links: Optional[dict]  
    years_of_experience: Optional[int]  
    availability: Optional[str]  

# Define the model for therapist response (including id)
class TherapistOutModel(BaseModel):
    id: str  
    name: str
    credentials: str
    specialties: List[str]
    location: str
    languages: List[str]
    insurance: List[str]
    telehealth: bool
    photo: str
    bio: str
    phone_number: Optional[str]  
    website: Optional[str] 
    social_links: Optional[dict]  
    years_of_experience: Optional[int] 
    availability: Optional[str]  

    class Config:
        orm_mode = True  

