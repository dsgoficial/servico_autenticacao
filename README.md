# Serviço de Autenticação

Serviço em Node.js e Cliente Web para autenticação de usuários. Sua utilização é necessária para executar os seguintes serviços da DSG:

- [Sistema de Apoio a Produção (SAP)](https://github.com/1cgeo/sap)
- [Gerenciador do FME](https://github.com/1cgeo/gerenciador_fme)

Para o tutorial sobre instalação acessar [aqui](https://github.com/dsgoficial/servico_autenticacao/wiki/Instala%C3%A7%C3%A3o).
Para mais informações acessar a [Wiki](https://github.com/1cgeo/auth_server/wiki).

## Releases
- [v.1.1.0](https://github.com/1cgeo/auth_server/releases/tag/v.1.1.0)
- [v.1.0.0](https://github.com/1cgeo/auth_server/releases/tag/v.1.0.0)

## Requisitos para sincronização com serviço LDAP local (existente no SPED).

1. Certifique-se que o serviço LDAP do SPED está aberto para a serviço de autenticação:
    Executar no computador do serviço LDAP:
    ```
    $ nano /etc/default/slapd # Editar:
    #SLAPD_SERVICES="ldap://127.0.0.1:389/ ldaps:/// ldapi:///"
    SLAPD_SERVICES="ldap://<IP_SERVIÇO_AUTENTICAÇÃO>/ ldapi://<IP_SERVIÇO_AUTENTICAÇÃO>/"

    $ service slapd restart
    ```

    Executar no computador do serviço de autenticação:
    ```
    $ apt install ldap-utils
    $ ldapsearch -H ldap://<IP_LDAP> -x -b dc=eb,dc=mil,dc=br # deve retornar até 500 usuários
    ```

2. Autorizar a pesquisa de mais de 500 usuários:
    Executar no computador do serviço LDAP:
    ```
    $ nano sizelimit.ldif # Adicionar o seguinte conteúdo
    dn: cn=config
    changetype: modify
    replace: olcSizeLimit
    olcSizeLimit: 7000

    $ ldapmodify -Q -Y EXTERNAL -H ldapi:// -f sizelimit.ldif
    ```

    Executar no computador do serviço de autenticação:
    ```
    $ apt install ldap-utils
    $ ldapsearch -H ldap://<IP_LDAP> -x -b dc=eb,dc=mil,dc=br # deve retornar até 7000 usuários
    ```