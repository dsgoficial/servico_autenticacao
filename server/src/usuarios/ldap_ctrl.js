'use strict'

const ldap = require('ldapjs');
var promise = require('bluebird');
const fs = require('fs');

const controller = {}
const path = require('path')
const configPath = path.join(__dirname, '..', '..', 'ldap.env')
const dotenv = require('dotenv')


controller.getLDAPusers = (ldapurl,basedn) => {
  return new Promise(function(resolve, reject) {
    const opts = {
        filter: '(objectClass=inetOrgPerson)',
        scope: 'sub',
        attributes: ['givenName', 'sn', 'cn']
      };

    const client = ldap.createClient({
      url: [ldapurl]
    });

    var users = [];
    
    client.on('error', (err) => {
      console.log(err);
      resolve(err)
    })
    client.search(basedn, opts, (err, res) => {

        if(err){
            console.log(err);
            return err
        }
        else{
            res.on('searchEntry', (entry) => {
            users.push(entry.object);
            });
            res.on('error', (err) => {
            console.error('error: ' + err.message);
            });
            res.on('end', (result) => {
            resolve(users)
            });
        }
      });
    });
}

controller.setLDAPenv = (basedn,ldapurl) => {
  return new Promise(function(resolve, reject) {
var msg=`basedn=${basedn}
ldapurl=${ldapurl}`
console.log(msg);
try{
    fs.writeFileSync(configPath, msg);
    resolve('Configurações Salvas com sucesso')
}catch (err){
    console.log(err);
}
});
}

controller.getLDAPenv = (basedn,ldapurl) => {
  return new Promise(function(resolve, reject) {
try{
    const data = fs.readFileSync(configPath, 'utf-8');
    const config = dotenv.parse(data)
    resolve(config)
}catch (err){
    console.log(err);
}
});
}
module.exports = controller