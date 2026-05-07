# Medical Equipment E-Commerce Platform - Diagrams

This folder contains all UML and system architecture diagrams for the graduation project.

## 📊 Diagrams Overview

### 1. **Use Case Diagram** (`use_case_diagram.drawio`)
Illustrates all actors and their interactions with the system.
- **Actors**: Customer (Healthcare Professional), Admin (Staff)
- **Use Cases**: Authentication, Product Management, Shopping Cart, Order Processing, Delivery Management, User Profile
- **Purpose**: Shows what actors can do in the system

### 2. **Class Diagram** (`class_diagram.drawio`)
Object-oriented design showing all classes and their relationships.
- **Classes**: User, Address, Category, Product, Order, OrderItem, DeliveryArea
- **Relationships**: Inheritance, Composition, Aggregation
- **Purpose**: Represents the static structure of the application

### 3. **Entity-Relationship (ER) Diagram** (`er_diagram.drawio`)
Shows the database schema and relationships between entities.
- **Entities**: User, Address, Category, Product, Order, OrderItem, DeliveryArea
- **Relationships**: 1:N, N:1, 1:1 cardinalities
- **Primary/Foreign Keys**: Clearly marked
- **Purpose**: Database design and structure

### 4. **Component Diagram** (`component_diagram.drawio`)
System architecture divided into logical components.
- **Layers**: 
  - Frontend Layer (React Application)
  - API Layer (Django REST Framework)
  - Business Logic Layer (Django Apps & Services)
  - Data Layer (PostgreSQL Database)
- **External Systems**: Payment Gateway, Email Service
- **Purpose**: Shows how system components interact

### 5. **Deployment Diagram** (`deployment_diagram.drawio`)
Describes the physical deployment infrastructure.
- **Nodes**: Web Server, Database Server, File Storage, Cache Server, Client Devices
- **Software**: Nginx, Gunicorn, PostgreSQL, Redis
- **Connections**: HTTPS, WSGI, SQL, SMTP protocols
- **Purpose**: Shows how components are deployed in production

### 6. **Sequence Diagram** (`sequence_diagram.drawio`)
Detailed interaction flow for the order placement process.
- **Actors**: Customer, React Frontend, Django API, Order Service, Product Service, PostgreSQL DB
- **Steps**: 22 sequential interactions from browsing to order confirmation
- **Purpose**: Shows the temporal sequence of system interactions

### 7. **Activity Diagram** (`activity_diagram.drawio`)
Business process flow showing all activities and decision points.
- **Start**: Customer browsing products
- **Activities**: Add to cart, View cart, Select address, Calculate fee, Process payment, Validate stock, Create order
- **Decisions**: Add to cart? → Proceed to checkout? → Payment successful? → Stock available?
- **End States**: Success, Payment failed, Insufficient stock
- **Purpose**: Shows the complete order workflow

---

## 🔍 How to Use These Diagrams

1. **Open in Draw.io**
   - Visit https://draw.io
   - File → Open → Select any `.drawio` file
   
2. **Open in VS Code**
   - Install the "Draw.io Integration" extension
   - Right-click on any `.drawio` file → Open with Draw.io

3. **View as PNG/PDF**
   - Open in Draw.io → File → Export as...

---

## 📋 Relationship Between Diagrams

```
Use Case Diagram (What actors do)
        ↓
    Class Diagram (System design)
        ↓
    ER Diagram (Database design)
        ↓
    Component Diagram (System architecture)
        ↓
    Deployment Diagram (Production setup)

Sequence Diagram (One specific interaction flow)
Activity Diagram (Overall business process)
```

---

## 🎯 Quick Reference

| Diagram | Shows | Used For |
|---------|-------|----------|
| Use Case | Actor interactions | Requirements & features |
| Class | Object structure | Software design |
| ER | Database schema | Database implementation |
| Component | System architecture | Technical design |
| Deployment | Infrastructure | Production deployment |
| Sequence | Interaction timeline | Detailed business flows |
| Activity | Process workflow | Business logic verification |

---

## 📝 Project Info

- **Project**: Medical Equipment E-Commerce Platform
- **Technologies**: Django 4.2.8, React 18.2.0, PostgreSQL
- **Created**: April 2026
- **Purpose**: E-commerce and delivery management system for medical equipment in Sudan
