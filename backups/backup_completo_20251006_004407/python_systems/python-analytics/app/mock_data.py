import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from typing import Dict, List

def generate_mock_data() -> Dict:
    """
    Gera dados mock realistas para simular um salão funcionando
    """
    
    # Período de dados: últimos 6 meses
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)
    
    # === CLIENTES ===
    clientes = []
    nomes_femininos = ["Ana", "Maria", "Juliana", "Patricia", "Carla", "Fernanda", "Gabriela", "Mariana", "Camila", "Beatriz",
                      "Larissa", "Rafaela", "Vanessa", "Priscila", "Amanda", "Bruna", "Daniela", "Luciana", "Renata", "Simone"]
    
    for i in range(150):  # 150 clientes
        cliente = {
            "id": f"client_{i+1}",
            "name": random.choice(nomes_femininos) + f" {random.choice(['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima'])}",
            "email": f"cliente{i+1}@email.com",
            "phone": f"11{random.randint(90000, 99999)}{random.randint(1000, 9999)}",
            "birth_date": (datetime.now() - timedelta(days=random.randint(18*365, 60*365))).strftime('%Y-%m-%d'),
            "created_at": (start_date + timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
            "segment": random.choice(['premium', 'regular', 'occasional']),
            "total_spent": 0  # Será calculado depois
        }
        clientes.append(cliente)
    
    # === SERVIÇOS ===
    servicos = [
        {"id": "service_1", "name": "Corte Feminino", "price": 45.0, "duration": 60, "category": "corte"},
        {"id": "service_2", "name": "Escova", "price": 35.0, "duration": 45, "category": "penteado"},
        {"id": "service_3", "name": "Tintura", "price": 120.0, "duration": 120, "category": "coloracao"},
        {"id": "service_4", "name": "Mechas", "price": 180.0, "duration": 180, "category": "coloracao"},
        {"id": "service_5", "name": "Hidratação", "price": 60.0, "duration": 90, "category": "tratamento"},
        {"id": "service_6", "name": "Progressiva", "price": 200.0, "duration": 240, "category": "tratamento"},
        {"id": "service_7", "name": "Sobrancelha", "price": 25.0, "duration": 30, "category": "estetica"},
        {"id": "service_8", "name": "Manicure", "price": 30.0, "duration": 60, "category": "unhas"},
        {"id": "service_9", "name": "Pedicure", "price": 35.0, "duration": 60, "category": "unhas"},
        {"id": "service_10", "name": "Unhas em Gel", "price": 80.0, "duration": 90, "category": "unhas"}
    ]
    
    # === PROFISSIONAIS ===
    profissionais = [
        {"id": "staff_1", "name": "Marina Souza", "specialties": ["corte", "coloracao"], "hourly_rate": 40.0},
        {"id": "staff_2", "name": "Carla Santos", "specialties": ["penteado", "tratamento"], "hourly_rate": 35.0},
        {"id": "staff_3", "name": "Ana Lima", "specialties": ["unhas", "estetica"], "hourly_rate": 30.0}
    ]
    
    # === AGENDAMENTOS E TRANSAÇÕES ===
    agendamentos = []
    transacoes = []
    
    appointment_id = 1
    transaction_id = 1
    
    # Simular agendamentos diários
    current_date = start_date
    while current_date <= end_date:
        # Pular domingos
        if current_date.weekday() == 6:
            current_date += timedelta(days=1)
            continue
            
        # Número de agendamentos por dia (varia por dia da semana)
        if current_date.weekday() == 5:  # Sábado
            num_appointments = random.randint(12, 18)
        elif current_date.weekday() in [1, 2, 3, 4]:  # Terça a sexta
            num_appointments = random.randint(8, 14)
        else:  # Segunda
            num_appointments = random.randint(4, 8)
            
        for _ in range(num_appointments):
            cliente = random.choice(clientes)
            servico = random.choice(servicos)
            profissional = random.choice([p for p in profissionais if servico['category'] in p['specialties']])
            
            # Horário do agendamento
            hora_inicio = random.randint(8, 17)  # 8h às 17h
            minuto_inicio = random.choice([0, 30])
            
            # Status do agendamento
            status_weights = [0.85, 0.10, 0.05]  # completed, cancelled, no_show
            status = random.choices(['completed', 'cancelled', 'no_show'], weights=status_weights)[0]
            
            agendamento = {
                "id": f"appointment_{appointment_id}",
                "client_id": cliente['id'],
                "service_id": servico['id'],
                "staff_id": profissional['id'],
                "date": current_date.strftime('%Y-%m-%d'),
                "time": f"{hora_inicio:02d}:{minuto_inicio:02d}",
                "status": status,
                "total_price": servico['price'],
                "duration": servico['duration']
            }
            agendamentos.append(agendamento)
            
            # Criar transação se o agendamento foi completado
            if status == 'completed':
                # Adicionar chance de desconto
                discount = 0
                if random.random() < 0.15:  # 15% chance de desconto
                    discount = random.choice([0.1, 0.15, 0.2])  # 10%, 15% ou 20%
                
                final_price = servico['price'] * (1 - discount)
                
                # Método de pagamento
                payment_method = random.choices(
                    ['dinheiro', 'cartao_debito', 'cartao_credito', 'pix'],
                    weights=[0.2, 0.25, 0.35, 0.2]
                )[0]
                
                transacao = {
                    "id": f"transaction_{transaction_id}",
                    "appointment_id": agendamento['id'],
                    "client_id": cliente['id'],
                    "amount": round(final_price, 2),
                    "payment_method": payment_method,
                    "date": current_date.strftime('%Y-%m-%d'),
                    "time": agendamento['time'],
                    "discount": discount,
                    "service_name": servico['name'],
                    "staff_name": profissional['name']
                }
                transacoes.append(transacao)
                
                # Atualizar total gasto do cliente
                cliente['total_spent'] += final_price
                
                transaction_id += 1
            
            appointment_id += 1
        
        current_date += timedelta(days=1)
    
    return {
        "clients": clientes,
        "services": servicos,
        "staff": profissionais,
        "appointments": agendamentos,
        "transactions": transacoes,
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "period": {
                "start": start_date.strftime('%Y-%m-%d'),
                "end": end_date.strftime('%Y-%m-%d')
            },
            "total_revenue": sum([t['amount'] for t in transacoes]),
            "total_appointments": len([a for a in agendamentos if a['status'] == 'completed'])
        }
    }