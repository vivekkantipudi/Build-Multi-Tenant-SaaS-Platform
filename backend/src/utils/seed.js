const bcrypt = require('bcrypt');
const pool = require('../config/db');

// SQL Schema Hardcoded to prevent file path errors
const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    max_users INTEGER DEFAULT 5,
    max_projects INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_email_per_tenant UNIQUE NULLS NOT DISTINCT (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id VARCHAR(255),
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('--- Connected to DB, Running Migrations ---');
    
    // 1. Run Schema
    await client.query(SCHEMA_SQL);
    console.log('--- Schema Applied ---');

    // 2. Check if seeded
    const check = await client.query("SELECT * FROM users WHERE email = 'superadmin@system.com'");
    if (check.rows.length > 0) {
        console.log('--- Database already seeded ---');
        return;
    }

    // 3. Seed Super Admin
    const superPass = await bcrypt.hash('Admin@123', 10);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role, tenant_id) 
       VALUES ($1, $2, $3, 'super_admin', NULL)`,
      ['superadmin@system.com', superPass, 'Super Admin']
    );

    // 4. Seed Tenant
    const tenantRes = await client.query(
      `INSERT INTO tenants (name, subdomain, status, subscription_plan) 
       VALUES ($1, $2, 'active', 'pro') RETURNING id`,
      ['Demo Company', 'demo']
    );
    const tenantId = tenantRes.rows[0].id;

    // 5. Seed Tenant Admin
    const adminPass = await bcrypt.hash('Demo@123', 10);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role, tenant_id) 
       VALUES ($1, $2, $3, 'tenant_admin', $4)`,
      ['admin@demo.com', adminPass, 'Demo Admin', tenantId]
    );

    // 6. Seed Regular User
    const userPass = await bcrypt.hash('User@123', 10);
    await client.query(
      `INSERT INTO users (email, password_hash, full_name, role, tenant_id) 
       VALUES ($1, $2, $3, 'user', $4)`,
      ['user1@demo.com', userPass, 'User One', tenantId]
    );

    console.log('--- Seeding Complete ---');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    client.release();
  }
};

module.exports = seedDatabase;