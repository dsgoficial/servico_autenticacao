'use strict'

const { db } = require('../database')

const { AppError, httpCode } = require('../utils')

const { loginController } = require('../login')

const bcrypt = require('bcryptjs')

const users = {}

const ldap = require('ldapjs');

var ldapurl = 'ldap://127.0.0.1:389';
var basedn = '';
const opts = {
    filter: '(objectClass=*)',
    scope: 'sub',
    attributes: ['dn', 'sn', 'cn']
  };

const client = ldap.createClient({
  url: [ldapurl]
});

client.on('error', (err) => {
  console.log(err)
})

client.search(basedn, opts, (err, res) => {
    if(err){
        console.log(err)
    }
    else{
        res.on('searchRequest', (searchRequest) => {
        console.log('searchRequest: ', searchRequest.messageID);
        });
        res.on('searchEntry', (entry) => {
        console.log('entry: ' + JSON.stringify(entry.object));
        });
        res.on('searchReference', (referral) => {
        console.log('referral: ' + referral.uris.join());
        });
        res.on('error', (err) => {
        console.error('error: ' + err.message);
        });
        res.on('end', (result) => {
        console.log('status: ' + result.status);
        });
    }
  });

console.log("Node is working");