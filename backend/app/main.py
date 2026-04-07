from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.analyze import router as analyze_router
from app.api.v1.simulate import router as simulate_router
from app.api.v1.insight import router as insight_router

app = FastAPI(title="Digital Twin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/analyze", tags=["Analyze"])
app.include_router(simulate_router, prefix="/simulate-medication", tags=["Simulate"])
app.include_router(insight_router, prefix="/insight", tags=["Insight"])
