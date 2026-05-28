-- ===============================
-- PULSELEDGER DATABASE SCHEMA
-- Run once: mysql -u root -p < database/schema.sql
-- ===============================

CREATE DATABASE IF NOT EXISTS pulseledger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pulseledger;

DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id            INT           NOT NULL AUTO_INCREMENT,
  username      VARCHAR(80)   NOT NULL UNIQUE,
  email         VARCHAR(120)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS trades (
  id             VARCHAR(36)    NOT NULL,
  user_id        INT            NOT NULL,
  date           DATE           NOT NULL,
  symbol         VARCHAR(20)    NOT NULL,
  market         VARCHAR(50)    DEFAULT NULL,
  side           ENUM('long','short') NOT NULL,
  strategy       VARCHAR(100)   DEFAULT NULL,
  quantity       DECIMAL(18,6)  NOT NULL,
  entry_price    DECIMAL(18,6)  NOT NULL,
  exit_price     DECIMAL(18,6)  NOT NULL,
  stop_price     DECIMAL(18,6)  DEFAULT NULL,
  fees           DECIMAL(18,6)  DEFAULT 0,
  gross_pl       DECIMAL(18,6)  DEFAULT NULL,
  net_pl         DECIMAL(18,6)  DEFAULT NULL,
  return_percent DECIMAL(10,4)  DEFAULT NULL,
  r_multiple     VARCHAR(10)    DEFAULT NULL,
  notes          TEXT           DEFAULT NULL,
  tags           VARCHAR(255)   DEFAULT NULL,
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
