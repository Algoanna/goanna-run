import os, csv
import numpy as np
import urllib.request, json 
from flask import Flask, escape, request, render_template, jsonify
from leaderboard.leaderboard import Leaderboard

import requests
import lxml.html as lh
import pandas as pd

from algosdk.v2client import algod
from algosdk import account, mnemonic

from config import *                                                                          
from algosdk.future.transaction import AssetConfigTxn, AssetTransferTxn                       
from algosdk.transaction import write_to_file                                                 
from util import balance_formatter, sign_and_send                                            
                                                                                              
#asset_id = 15823566                                                                          
asset_id = 40711649
import time, sys, random
import logging, json



# Setup HTTP client w/guest key provided by PureStake
class Connect():
    def __init__(self):
        # declaring the third party API
        self.algod_address = "https://testnet-algorand.api.purestake.io/ps2"
        self.algod_token = os.environ.get('PURESTAKE_API_KEY') # Sign up
        # PURESTAKE.COM to get your personal token
        self.headers = {"X-API-Key": self.algod_token}

    def connectToNetwork(self):
        # establish connection
        return algod.AlgodClient(self.algod_token, self.algod_address, self.headers)

client = Connect().connectToNetwork()                              

def check_holdings(asset_id, address):
    """
    Checks the asset balance for the specific address and asset id.
    """
    account_info = client.account_info(address)
    assets = account_info.get("assets")
    if assets:
        asset_holding = None
        for i in account_info["assets"]: 
           if i['asset-id'] == asset_id:
             return i

def revoke(asset_id, address, receiver_address, passphrase=None, target=None):
    """
    Creates an unsigned transfer transaction for the specified asset id, to the 
    specified address, for the specified amount.
    """
    params = client.suggested_params()
    params.fee = 1000
    params.flat_fee = True
    amount = 1
    txn = AssetTransferTxn(sender=address,
            sp=params,
            receiver=receiver_address,
            amt=amount,
            index=asset_id,
            revocation_target=target)
    #data = add_network_params(transfer_data, client)
    #txn = AssetTransferTxn(**data)
    if passphrase:
        txinfo = sign_and_send(txn, passphrase, client)
        #formatted_amount = balance_formatter(amount, asset_id, client)
        print("Transferred {} from {} to {}".format(str(amount),
            address, receiver_address))
        print("Transaction ID Confirmation: {}".format(txinfo.get("txn")))
    else:
        write_to_file([txn], "clawback"+address+".txn")


def transfer(asset_id, address, receiver_address, passphrase=None):
    """
    Creates an unsigned transfer transaction for the specified asset id, to the 
    specified address, for the specified amount.
    """
    params = client.suggested_params()
    params.fee = 1000
    params.flat_fee = True
    txn = AssetTransferTxn(sender=address,
            sp=params,
            receiver=receiver_address,
            amt=1,
            index=asset_id)
    #data = add_network_params(transfer_data, client)
    #txn = AssetTransferTxn(**data)
    if passphrase:
        txinfo = sign_and_send(txn, passphrase, client)
        formatted_amount = balance_formatter(amount, asset_id, client)
        print("Transferred {} from {} to {}".format(formatted_amount,
            address, receiver_address))
        print("Transaction ID Confirmation: {}".format(txinfo.get("tx")))
    else:
        write_to_file([txn], "transfer"+address+".txn")


highscore_lb = Leaderboard('highscores')
app = Flask(__name__)


@app.route('/score', methods=['POST'])
def score():
    name  = request.form.get('name', '')
    address  = request.form.get('address', '')
    txid  = request.form.get('txid', '')

    if (not name or not address): 
      return 'name and address is required'

    score  = float(request.form.get('score', 0))
    print(name, score)
    def highscore_check(
                self,
                member,
                current_score,
                score,
                member_data,
                leaderboard_options):
            if (current_score is None):
                return True
            if (score > current_score):
                return True
            return False

    key = name.replace('@','') + '@' + address

    oscore = highscore_lb.member_at(1)


    if (not txid):
      highscore_lb.rank_member_if(highscore_check, key, score)

    nscore = highscore_lb.score_for(key)

    result = 'saved'
    beaten = ''

    if (oscore == None):
        result = 'high'
        print('asset goes to you')
        revoke(asset_id, goanna_address, address, goanna_passphrase, goanna_address)
    else:

        omember = oscore['member'].decode('ascii')

        oname = omember.split('@')
        beaten = oname[0] + '#' + oname[1][-4:]

        oaddress = omember.split('@')[1]
        oscore = oscore['score']
    

        print('txid', txid, 'scores', oscore, nscore)

        if (oscore < nscore):
    	    print('{} beat high score with {}, the highest was {} who scored {}'
                 .format(name, str(nscore), omember, str(oscore)))
    	    if (key != omember):
              print("transfer asset to", address, "from", oaddress)
              revoke(asset_id, goanna_address, address, goanna_passphrase, oaddress)
              result = 'high'
    
        elif (nscore > score):
    	    print('high score for you {} is {}, the highest is {} who scored {}'
                 .format(name, str(nscore), omember, str(oscore)))
        else:
    	    print('new high score for you {} is {}, the highest is {} who scored {}'
                 .format(name, str(nscore), omember, str(oscore)))


    
    response = jsonify({'score': result, 'note': beaten})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

P = 50111

def encrypt(x):
    a = np.random.randint(-P,P)
    b = np.random.randint(-P,P)
    #print(a, b)
    c = (x - a - b) % P
    #print(x, [a, b, c], decrypt(np.array((a, b, c))))
    return np.array((a, b, c))

def decrypt(x):
    return np.sum(x) % P

def multiply(x, y):
    u1 = (x[1]*y[1] + x[1]*y[2] + x[2]*y[1])%P
    u2 = (x[2]*y[2] + x[0]*y[2] + x[2]*y[0])%P
    u3 = (x[0]*y[0] + x[0]*y[1] + x[1]*y[0])%P
    return decrypt((u1,u2,u3))


@app.route('/encrypt', methods=['POST'])
def enc():
    i  = request.form.get('input', '0')

    result = []
    if ("," in i):
        ss = i.split(',')
        for s in ss:
          result.append(encrypt(int(s)).tolist())
          print(s, decrypt(encrypt(int(s)).tolist()))
    else:
        result = encrypt(i).tolist()
    response = jsonify({'result': result})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/top10')
def index():
    leaders = highscore_lb.leaders(1)
    for i in range(0, len(leaders)):

      leader = leaders[i]['member'].decode('ascii').split('@')
      leaders[i]['playerName'] = leader[0] + '#' + leader[1][-4:]
      leaders[i]['score'] = str(int(leaders[i]['score']))
      del leaders[i]['member']
      del leaders[i]['rank']

    response = jsonify(leaders)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/check')
def check():
    address  = request.args.get('address', '')

    print(address)
    if (not address): 
      return 'address is required'

    holdings = check_holdings(asset_id, address)

    response = jsonify(holdings)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

    #return render_template('index.html', leaders=leaders)
