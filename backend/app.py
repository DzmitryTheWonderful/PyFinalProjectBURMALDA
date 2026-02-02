from flask import Flask, jsonify, request
from flask_cors import CORS

import random

#инициализация
app = Flask(__name__)
CORS(app)


#-----------------------константы

# символы для слотов Бурмалды)))
SYMBOLS = [
    '🍒',
    '🍋', 
    '🍊', 
    '🍇', 
    '⭐', 
    '7️⃣', 
    '💎'
]
# множители выигрыша
JackpotX = 10
ParaX = 2
# лимиты ставок
MinStavka = 1
MaxStavka = 10
# стартовый баланс
StartBalance = 100



# баланс гоя и ставка (состояние игры)
igrovoeSostoyanie = {
    'balance': StartBalance,
    'bet': MinStavka,
    'win_streak': 0,
    'total_wins': 0,
    'total_jackpots': 0
}

  


#-------------ниже весь основной функционал

@app.route('/api/state', methods=['GET'])
def getState():
    """Получить текущее состояние игры"""
    return jsonify(igrovoeSostoyanie)






@app.route('/api/bet', methods=['POST'])
def setStavka():
    """Изменить ставку (+1 или -1)"""
    telo = request.json
    deltaStavki = telo.get('change', 0)
    
    newStavka = igrovoeSostoyanie['bet'] + deltaStavki
    

    #ограничения минимум 1, максимум 10
    if newStavka < MinStavka:
        newStavka = MinStavka
    elif newStavka > MaxStavka:
        newStavka = MaxStavka
    
    # если у гоя нет денег гой не депает
    if newStavka > igrovoeSostoyanie['balance']:
        newStavka = igrovoeSostoyanie['balance']
    igrovoeSostoyanie['bet'] = newStavka
    

    otvet = {
        'bet': igrovoeSostoyanie['bet'],
        'balance': igrovoeSostoyanie['balance']
    }
    
    return jsonify(otvet)







@app.route('/api/spin', methods=['POST'])
def spin():
    """Крутить барабаны"""
    
    tekBalik = igrovoeSostoyanie['balance']
    stavka = igrovoeSostoyanie['bet']
    SeriaPobed = igrovoeSostoyanie['win_streak']
    
    # проверка финансового состояния гоя
    if tekBalik <= 0:
        return jsonify({
            'error': True,
            'message': 'Гоев нагрели',
            'balance': 0,
            'reels': ['❌', '❌', '❌'],
            'win_streak': igrovoeSostoyanie['win_streak'],
            'total_wins': igrovoeSostoyanie['total_wins'],
            'total_jackpots': igrovoeSostoyanie['total_jackpots']
        })
    
    
    # ставка не больше баланса
    if stavka > tekBalik:
        stavka = tekBalik
        igrovoeSostoyanie['bet'] = stavka
    
    
    # грабеж гоя
    igrovoeSostoyanie['balance'] -= stavka
    
    
    # результат ЧЕЕЕЕЕ реальныйц рандом
    Kartinka1 = random.choice(SYMBOLS)
    Kartinka2 = random.choice(SYMBOLS)
    Kartinka3 = random.choice(SYMBOLS)
    reels = [Kartinka1, Kartinka2, Kartinka3]
    
    
    # начальные значения результата
    vigrish = 0
    jackpot = False
    win = False
    message = "Попробуй ещё!"
    
    
    # расчёт выигрыша :(
    vseOdinakovo = (Kartinka1 == Kartinka2 == Kartinka3)
    estPara = (Kartinka1 == Kartinka2) or (Kartinka2 == Kartinka3) or (Kartinka1 == Kartinka3)
    
    
    if vseOdinakovo:
        # джекпот 3 одинаковых
        vigrish = stavka * JackpotX
        jackpot = True
        win = True
        message = f"🎉 ДЖЕКПОТ! +{vigrish}"
        
        SeriaPobed += 1
        igrovoeSostoyanie['total_wins'] += 1
        igrovoeSostoyanie['total_jackpots'] += 1
        
    elif estPara:
        # Пара 2 одинаковых
        vigrish = stavka * ParaX
        win = True
        message = f"🎊 Выигрыш! +{vigrish}"
        
        SeriaPobed += 1
        igrovoeSostoyanie['total_wins'] += 1
        
    else:
        # Проигрыш серия сбрасывается
        SeriaPobed = 0
    
    
    # выигрыш
    igrovoeSostoyanie['balance'] += vigrish

    # сохраняем серию побед обратно в состояние
    igrovoeSostoyanie['win_streak'] = SeriaPobed
    
    
    # смерть в нищете
    broke = igrovoeSostoyanie['balance'] <= 0
    
    if broke:
        message = "Гоев нагрели"
    
    
    otvet = {
        'reels': reels,
        'win': win,
        'jackpot': jackpot,
        'win_amount': vigrish,
        'message': message,
        'balance': igrovoeSostoyanie['balance'],
        'bet': igrovoeSostoyanie['bet'],
        'broke': broke,
        'win_streak': igrovoeSostoyanie['win_streak'],
        'total_wins': igrovoeSostoyanie['total_wins'],
        'total_jackpots': igrovoeSostoyanie['total_jackpots']
    }
    
    return jsonify(otvet)



@app.route('/api/reset', methods=['POST'])
def resetBalik():
    """сбросить баланс и обнулить статистику"""
    
    igrovoeSostoyanie['balance'] = StartBalance
    igrovoeSostoyanie['bet'] = MinStavka
    igrovoeSostoyanie['win_streak'] = 0
    igrovoeSostoyanie['total_wins'] = 0
    igrovoeSostoyanie['total_jackpots'] = 0
    
    otvet = {
        'balance': igrovoeSostoyanie['balance'],
        'bet': igrovoeSostoyanie['bet'],
        'message': 'Баланс восстановлен!',
        'win_streak': 0,
        'total_wins': 0,
        'total_jackpots': 0
    }
    
    return jsonify(otvet)


if __name__ == '__main__':
    app.run(debug=True, port=5000)