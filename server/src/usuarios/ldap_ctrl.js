'use strict'

const ldap = require('ldapjs');
var promise = require('bluebird');

//var ldapurl = 'ldap://127.0.0.1:389';
//var basedn = 'dc=eb,dc=mil,dc=br';
const controller = {}

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
      return err
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

/*controller.getLDAPusers('ldap://127.0.0.1:389','dc=eb,dc=mil,dc=br').then(function (users) {
      const msg = 'Usuários retornados com sucesso'
      console.log(msg,users)
    });
*/
module.exports = controller