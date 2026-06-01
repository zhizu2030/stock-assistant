from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
import uvicorn

from models import Base, Stock, KLineData
from data_collector import init_db, get_db, DATABASE_URL, engine

app = FastAPI(title="Stock Data API", version="1.0.0")

# CORS配置 - 允许所有源（开发用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic模型
class StockResponse(BaseModel):
    code: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: int
    high: float
    low: float
    open: float
    updated_at: Optional[datetime] = None

class KLineResponse(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    change: float
    change_percent: float

@app.on_event("startup")
async def startup_event():
    init_db()
    print("数据库初始化完成！")

@app.get("/")
def root():
    return {
        "message": "Stock Data API Server",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/stocks", response_model=List[StockResponse])
def get_stocks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stocks = db.query(Stock).order_by(Stock.volume.desc()).offset(skip).limit(limit).all()
    
    return [
        StockResponse(
            code=stock.code,
            name=stock.name,
            price=stock.price,
            change=stock.change,
            change_percent=stock.change_percent,
            volume=stock.volume,
            high=stock.high,
            low=stock.low,
            open=stock.open,
            updated_at=stock.updated_at
        )
        for stock in stocks
    ]

@app.get("/api/stocks/{code}", response_model=StockResponse)
def get_stock_by_code(code: str, db: Session = Depends(get_db)):
    stock = db.query(Stock).filter(Stock.code == code).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    return StockResponse(
        code=stock.code,
        name=stock.name,
        price=stock.price,
        change=stock.change,
        change_percent=stock.change_percent,
        volume=stock.volume,
        high=stock.high,
        low=stock.low,
        open=stock.open,
        updated_at=stock.updated_at
    )

@app.get("/api/stocks/{code}/kline", response_model=List[KLineResponse])
def get_kline_data(
    code: str, 
    days: int = 60, 
    db: Session = Depends(get_db)
):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    kline_data = db.query(KLineData).filter(
        KLineData.code == code,
        KLineData.date >= start_date,
        KLineData.date <= end_date
    ).order_by(KLineData.date).all()
    
    return [
        KLineResponse(
            date=kline.date.strftime('%Y-%m-%d'),
            open=kline.open,
            high=kline.high,
            low=kline.low,
            close=kline.close,
            volume=kline.volume,
            change=kline.change,
            change_percent=kline.change_percent
        )
        for kline in kline_data
    ]

@app.get("/api/search")
def search_stocks(query: str, db: Session = Depends(get_db)):
    query = query.lower()
    stocks = db.query(Stock).filter(
        (Stock.code.ilike(f'%{query}%')) |
        (Stock.name.ilike(f'%{query}%')) |
        (Stock.pinyin.ilike(f'%{query}%'))
    ).limit(50).all()
    
    return [
        StockResponse(
            code=stock.code,
            name=stock.name,
            price=stock.price,
            change=stock.change,
            change_percent=stock.change_percent,
            volume=stock.volume,
            high=stock.high,
            low=stock.low,
            open=stock.open,
            updated_at=stock.updated_at
        )
        for stock in stocks
    ]

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": DATABASE_URL}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
