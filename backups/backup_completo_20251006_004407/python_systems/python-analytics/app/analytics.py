import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class AnalyticsEngine:
    """
    Engine principal para analytics avançados do salão
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        
    def get_dashboard_summary(self, data: Dict) -> Dict:
        """
        Retorna resumo completo para o dashboard principal
        """
        transactions_df = pd.DataFrame(data['transactions'])
        appointments_df = pd.DataFrame(data['appointments'])
        clients_df = pd.DataFrame(data['clients'])
        
        # Métricas gerais
        total_revenue = transactions_df['amount'].sum()
        avg_ticket = transactions_df['amount'].mean()
        total_clients = len(clients_df)
        active_clients = len(transactions_df['client_id'].unique())
        
        # Métricas do mês atual
        current_month = datetime.now().strftime('%Y-%m')
        current_month_transactions = transactions_df[
            transactions_df['date'].str.startswith(current_month)
        ]
        
        monthly_revenue = current_month_transactions['amount'].sum()
        monthly_appointments = len(current_month_transactions)
        
        # Taxa de conversão
        completed_appointments = len(appointments_df[appointments_df['status'] == 'completed'])
        total_scheduled = len(appointments_df)
        conversion_rate = (completed_appointments / total_scheduled) * 100 if total_scheduled > 0 else 0
        
        # Crescimento mês anterior
        last_month = (datetime.now() - timedelta(days=30)).strftime('%Y-%m')
        last_month_revenue = transactions_df[
            transactions_df['date'].str.startswith(last_month)
        ]['amount'].sum()
        
        growth_rate = ((monthly_revenue - last_month_revenue) / last_month_revenue * 100) if last_month_revenue > 0 else 0
        
        # Top serviços
        top_services = (
            transactions_df.groupby('service_name')
            .agg({
                'amount': ['sum', 'count'],
                'client_id': 'nunique'
            })
            .round(2)
        )
        
        # Padrão semanal
        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        transactions_df['day_of_week'] = transactions_df['date'].dt.day_name()
        
        weekly_pattern = (
            transactions_df.groupby('day_of_week')['amount']
            .agg(['sum', 'count'])
            .reindex(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .fillna(0)
        )
        
        return {
            "overview": {
                "total_revenue": round(total_revenue, 2),
                "monthly_revenue": round(monthly_revenue, 2),
                "avg_ticket": round(avg_ticket, 2),
                "total_clients": total_clients,
                "active_clients": active_clients,
                "conversion_rate": round(conversion_rate, 1),
                "growth_rate": round(growth_rate, 1)
            },
            "top_services": {
                service: {
                    "revenue": float(values[('amount', 'sum')]),
                    "count": int(values[('amount', 'count')]),
                    "unique_clients": int(values[('client_id', 'nunique')])
                }
                for service, values in top_services.head(5).iterrows()
            },
            "weekly_pattern": {
                day: {
                    "revenue": float(values['sum']),
                    "appointments": int(values['count'])
                }
                for day, values in weekly_pattern.iterrows()
            },
            "kpis": {
                "best_day": weekly_pattern['sum'].idxmax(),
                "busiest_day": weekly_pattern['count'].idxmax(),
                "avg_daily_revenue": round(weekly_pattern['sum'].mean(), 2),
                "avg_daily_appointments": round(weekly_pattern['count'].mean(), 1)
            }
        }
    
    def forecast_revenue(self, data: Dict) -> Dict:
        """
        Previsão de receita usando regressão linear e análise de tendência
        """
        transactions_df = pd.DataFrame(data['transactions'])
        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        
        # Agrupação diária
        daily_revenue = (
            transactions_df.groupby('date')['amount']
            .sum()
            .reset_index()
        )
        
        # Criar features temporais
        daily_revenue['day_number'] = (daily_revenue['date'] - daily_revenue['date'].min()).dt.days
        daily_revenue['day_of_week'] = daily_revenue['date'].dt.dayofweek
        daily_revenue['month'] = daily_revenue['date'].dt.month
        
        # Modelo de regressão linear
        X = daily_revenue[['day_number', 'day_of_week', 'month']]
        y = daily_revenue['amount']
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Previsão para próximos 30 dias
        last_day = daily_revenue['day_number'].max()
        future_days = []
        
        for i in range(1, 31):
            future_date = daily_revenue['date'].max() + timedelta(days=i)
            future_days.append({
                'day_number': last_day + i,
                'day_of_week': future_date.weekday(),
                'month': future_date.month,
                'date': future_date
            })
        
        future_df = pd.DataFrame(future_days)
        future_X = future_df[['day_number', 'day_of_week', 'month']]
        
        predictions = model.predict(future_X)
        
        # Métricas de tendência
        recent_7d = daily_revenue.tail(7)['amount'].mean()
        recent_30d = daily_revenue.tail(30)['amount'].mean()
        overall_avg = daily_revenue['amount'].mean()
        
        trend = "crescente" if recent_7d > recent_30d else "decrescente" if recent_7d < recent_30d else "estável"
        
        return {
            "predictions": {
                "next_7_days": round(sum(predictions[:7]), 2),
                "next_15_days": round(sum(predictions[:15]), 2),
                "next_30_days": round(sum(predictions), 2),
                "daily_predictions": [
                    {
                        "date": future_days[i]['date'].strftime('%Y-%m-%d'),
                        "predicted_revenue": round(predictions[i], 2)
                    }
                    for i in range(7)  # Próximos 7 dias
                ]
            },
            "trends": {
                "recent_7d_avg": round(recent_7d, 2),
                "recent_30d_avg": round(recent_30d, 2),
                "overall_avg": round(overall_avg, 2),
                "trend_direction": trend,
                "confidence_score": round(model.score(X, y), 2)
            },
            "insights": {
                "best_forecast_day": future_df.loc[predictions.argmax(), 'date'].strftime('%Y-%m-%d'),
                "max_predicted_revenue": round(predictions.max(), 2),
                "min_predicted_revenue": round(predictions.min(), 2)
            }
        }
    
    def analyze_clients(self, data: Dict) -> Dict:
        """
        Análise RFM e segmentação de clientes
        """
        transactions_df = pd.DataFrame(data['transactions'])
        clients_df = pd.DataFrame(data['clients'])
        
        # Calcular RFM
        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        reference_date = transactions_df['date'].max()
        
        rfm = transactions_df.groupby('client_id').agg({
            'date': lambda x: (reference_date - x.max()).days,  # Recency
            'id': 'count',  # Frequency
            'amount': 'sum'  # Monetary
        }).round(2)
        
        rfm.columns = ['recency', 'frequency', 'monetary']
        
        # Scores RFM (1-5)
        rfm['r_score'] = pd.qcut(rfm['recency'].rank(ascending=False), 5, labels=[5,4,3,2,1])
        rfm['f_score'] = pd.qcut(rfm['frequency'].rank(ascending=True), 5, labels=[1,2,3,4,5])
        rfm['m_score'] = pd.qcut(rfm['monetary'].rank(ascending=True), 5, labels=[1,2,3,4,5])
        
        # Segmentação
        def segment_clients(row):
            r, f, m = int(row['r_score']), int(row['f_score']), int(row['m_score'])
            
            if r >= 4 and f >= 4 and m >= 4:
                return 'Champions'
            elif r >= 3 and f >= 3 and m >= 3:
                return 'Loyal Customers'
            elif r >= 4 and f <= 2:
                return 'New Customers'
            elif r <= 2 and f >= 3:
                return 'At Risk'
            elif r <= 2 and f <= 2 and m >= 3:
                return 'Cannot Lose Them'
            else:
                return 'Others'
        
        rfm['segment'] = rfm.apply(segment_clients, axis=1)
        
        # Estatísticas por segmento
        segment_stats = rfm.groupby('segment').agg({
            'recency': 'mean',
            'frequency': 'mean',
            'monetary': 'mean'
        }).round(2)
        
        segment_counts = rfm['segment'].value_counts().to_dict()
        
        # Top clientes
        top_clients = rfm.nlargest(10, 'monetary')[['frequency', 'monetary', 'segment']]
        
        return {
            "segmentation": {
                "counts": segment_counts,
                "stats": segment_stats.to_dict('index')
            },
            "top_clients": {
                client_id: {
                    "frequency": int(values['frequency']),
                    "monetary": float(values['monetary']),
                    "segment": values['segment']
                }
                for client_id, values in top_clients.iterrows()
            },
            "insights": {
                "total_segments": len(segment_counts),
                "largest_segment": max(segment_counts, key=segment_counts.get),
                "avg_customer_value": round(rfm['monetary'].mean(), 2),
                "avg_frequency": round(rfm['frequency'].mean(), 1),
                "retention_opportunity": segment_counts.get('At Risk', 0)
            }
        }
    
    def analyze_service_performance(self, data: Dict) -> Dict:
        """
        Análise de performance dos serviços
        """
        transactions_df = pd.DataFrame(data['transactions'])
        services_df = pd.DataFrame(data['services'])
        
        # Performance por serviço
        service_performance = transactions_df.groupby('service_name').agg({
            'amount': ['sum', 'mean', 'count'],
            'client_id': 'nunique'
        }).round(2)
        
        service_performance.columns = ['total_revenue', 'avg_price', 'total_bookings', 'unique_clients']
        
        # Adicionar margem (assumindo 60% de margem)
        service_performance['estimated_profit'] = service_performance['total_revenue'] * 0.6
        
        # Rentabilidade por hora (assumindo duração dos serviços)
        services_dict = {s['name']: s['duration'] for s in services_df}
        service_performance['duration'] = service_performance.index.map(services_dict)
        service_performance['revenue_per_hour'] = (
            service_performance['avg_price'] / (service_performance['duration'] / 60)
        ).round(2)
        
        # Categoria analysis
        services_categories = {s['name']: s['category'] for s in services_df}
        transactions_df['category'] = transactions_df['service_name'].map(services_categories)
        
        category_performance = transactions_df.groupby('category').agg({
            'amount': ['sum', 'count'],
            'client_id': 'nunique'
        }).round(2)
        
        return {
            "services": service_performance.to_dict('index'),
            "categories": {
                category: {
                    "revenue": float(values[('amount', 'sum')]),
                    "bookings": int(values[('amount', 'count')]),
                    "unique_clients": int(values[('client_id', 'nunique')])
                }
                for category, values in category_performance.iterrows()
            },
            "rankings": {
                "most_profitable": service_performance.nlargest(5, 'total_revenue').index.tolist(),
                "most_popular": service_performance.nlargest(5, 'total_bookings').index.tolist(),
                "highest_revenue_per_hour": service_performance.nlargest(5, 'revenue_per_hour').index.tolist()
            }
        }
    
    def analyze_staff_productivity(self, data: Dict) -> Dict:
        """
        Análise de produtividade da equipe
        """
        transactions_df = pd.DataFrame(data['transactions'])
        appointments_df = pd.DataFrame(data['appointments'])
        staff_df = pd.DataFrame(data['staff'])
        
        # Merge para ter dados completos
        merged = appointments_df.merge(
            transactions_df, 
            left_on='id', 
            right_on='appointment_id', 
            how='left'
        )
        
        # Produtividade por profissional
        staff_performance = merged.groupby('staff_id').agg({
            'amount': ['sum', 'mean', 'count'],
            'client_id': 'nunique',
            'duration': 'sum'
        }).fillna(0).round(2)
        
        staff_performance.columns = ['total_revenue', 'avg_ticket', 'total_services', 'unique_clients', 'total_hours']
        
        # Converter minutos para horas
        staff_performance['total_hours'] = staff_performance['total_hours'] / 60
        staff_performance['revenue_per_hour'] = (
            staff_performance['total_revenue'] / staff_performance['total_hours']
        ).round(2)
        
        # Adicionar nomes dos profissionais
        staff_names = {s['id']: s['name'] for s in staff_df}
        
        return {
            "individual_performance": {
                staff_names.get(staff_id, staff_id): {
                    "total_revenue": float(values['total_revenue']),
                    "avg_ticket": float(values['avg_ticket']),
                    "total_services": int(values['total_services']),
                    "unique_clients": int(values['unique_clients']),
                    "total_hours": round(values['total_hours'], 1),
                    "revenue_per_hour": float(values['revenue_per_hour'])
                }
                for staff_id, values in staff_performance.iterrows()
            },
            "team_summary": {
                "total_team_revenue": float(staff_performance['total_revenue'].sum()),
                "avg_team_productivity": round(staff_performance['revenue_per_hour'].mean(), 2),
                "total_team_hours": round(staff_performance['total_hours'].sum(), 1),
                "most_productive": staff_names.get(
                    staff_performance['revenue_per_hour'].idxmax(), 
                    "N/A"
                )
            }
        }