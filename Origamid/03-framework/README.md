# Estrutura Base do Framework

Este documento explica a arquitetura e a estrutura base do framework, detalhando como os componentes principais interagem entre si para a construção de APIs.

## Arquitetura

O fluxo de dados e dependências do framework segue uma estrutura hierárquica, baseada em injeção de dependências ou herança, onde os componentes mais básicos alimentam as classes de mais alto nível.

### 1. Módulos Base

Os módulos base fornecem as funcionalidades independentes fundamentais do framework:

*   **`core` (`class Core`):** Contém as funções e configurações centrais da aplicação.
*   **`router` (`class Router`):** Responsável pelo gerenciamento de rotas e processamento das requisições web.
*   **`db` (`class Database`):** Responsável pelo gerenciamento, conexão e comunicação com o banco de dados.

### 2. Provedor de Funcionalidades

*   **`class CoreProvider`:** Atua como o **provedor de funcionalidades**. Ele unifica e consome os módulos base (`Core`, `Router`, `Database`), disponibilizando todas as ferramentas integradas necessárias para a construção do resto da aplicação.

### 3. Template de API

*   **`class Api`:** Serve como um **template para API's**. Derivado do `CoreProvider`, ele fornece o formato padrão e os métodos abstratos que devem ser implementados para criar uma interface de API coesa. 

### 4. Implementação da API

A partir da `class Api`, o desenvolvimento da aplicação se divide em três responsabilidades principais de implementação:

*   **`handlers`:** Onde fica a **lista de handlers** (controladores). Responsáveis por lidar com as lógicas específicas de cada requisição.
*   **`tables`:** Responsável pela **criação das tabelas** e estruturação do banco de dados (schema).
*   **`routes`:** Onde é feito o **registro das rotas**, ligando as URLs da API aos seus respectivos `handlers`.
