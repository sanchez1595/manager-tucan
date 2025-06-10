from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, clients, projects

app = FastAPI(title="Tucan Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(projects.router)

@app.get("/")
async def root():
    return {"message": "Tucan Manager API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/services/types")
async def get_service_types():
    """Obtener tipos de servicios disponibles"""
    from models import ServiceType
    return {
        "services": [
            {"value": service.value, "label": service.value.replace("_", " ").title()}
            for service in ServiceType
        ]
    }