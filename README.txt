Project

Overview

This is a personal project where I build an E-commerce website from sratch. The website is set
up to sell unique custom artwork that is made inhouse. It is going to allow for user login, 
database storing information, encyrption of passwords, security and the ability to buy products 
and update inventory.

Tools Used:

        1. VSCode
        2. Postman
        3. Spring Boot + IntelliJ
        4. Java
        5. Angular CLI
        6. Node JS
        7. Git
        8. MSQL + Workbench/Postgres

Design

        Backend Architecture:

        ┌──────────────────────────────────┐
        │         Controller Layer         |  (@Controller)
        │   - Handles HTTP requests (API)  │
        │   - Calls Service Layer          │
        └──────────────┬───────────────────┘
                       │
        ┌──────────────▼───────────────────┐
        │          Service Layer           │  (@Service)
        │   - Business logic               │
        │   - Calls DAO (Repository) Layer │
        └──────────────┬───────────────────┘
                       │
        ┌──────────────▼───────────────────┐
        │          DAO Layer (Repository)  │  (@Dao)
        │   - Handles database operations  │
        │   - Uses JPA (Spring Data)       │
        └──────────────┬───────────────────┘
                       │
        ┌──────────────▼───────────────────┐
        │         Entity Layer             │  (@Entity)
        │   - Represents Database Table    │
        │   - Contains fields & mappings   │
        └──────────────────────────────────┘
                       │
        ┌──────────────▼───────────────────┐
        │          Configuration Layer     │  (@Configuration)
        │   - Defines Beans (Security, DB) │
        │   - Handles JWT & Auth settings  │
        └──────────────────────────────────┘
                       |
        ┌──────────────▼───────────────────┐
        │          Util Layer              │  (@Util)
        │   - Common Helper Functions (JWT)│
        └──────────────────────────────────┘

1.      Database and API Integration

        Connect MYSQL database with IntelliJ(Java) for backend development using API Endpoints.

        Testing:
        Postman is used to test that data is being sent and processed correctly from API 
        endpoint to MYSQL and queries on MYSQL Workbench to test database is updating. 

2.      Implementing Token and Role Base Authentication

        Spring Boot             : manage api endpoints and database integration
        JWT                     : generates and validates tokens
        IntelliJ/Java           : project framework and dependencies + backend
        MySQL + Workbench       : database creation, storage, testing and queries
        Postman                 : testing raw data through api endpoints to database


3.      Authentication Flow:

        Browser                                 Server

        Login --------------------------------> Create JWT 
        Send JWT to Browser <------------------ Create JWT
        Send JWT to Server -------------------> Verify JWT Token
        Send response to Client <-------------- Verify JWT Token

