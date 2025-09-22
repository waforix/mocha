# @waforix/mocha Documentation

Welcome to the comprehensive documentation for **@waforix/mocha**, a powerful and flexible Discord bot framework with advanced statistics tracking, autocomplete functionality, and multi-database support.

## 📚 Documentation Index

### Getting Started

- **[Getting Started](https://github.com/waforix/mocha/wiki/Getting-Started)** - Installation and basic setup
- **[Quick Examples](https://github.com/waforix/mocha/wiki/Quick-Examples)** - Simple examples to get you started

### Core Documentation

- **[Client Configuration](https://github.com/waforix/mocha/wiki/Client-Configuration)** - Complete client setup and configuration options
- **[Database Configuration](https://github.com/waforix/mocha/wiki/Database-Configuration)** - SQLite, PostgreSQL, and MySQL setup
- **[Command System](https://github.com/waforix/mocha/wiki/Command-System)** - Building and handling slash commands
- **[Autocomplete System](https://github.com/waforix/mocha/wiki/Autocomplete-System)** - Dynamic autocomplete functionality
- **[Event Tracking](https://github.com/waforix/mocha/wiki/Event-Tracking)** - Comprehensive Discord event tracking
- **[Analytics & Statistics](https://github.com/waforix/mocha/wiki/Analytics-Statistics)** - Advanced analytics and reporting

### Advanced Topics

- **[Data Export](https://github.com/waforix/mocha/wiki/Data-Export)** - Export data for backup and analysis
- **[Performance Optimization](https://github.com/waforix/mocha/wiki/Performance-Optimization)** - Production optimization tips
- **[Migration Guide](https://github.com/waforix/mocha/wiki/Migration-Guide)** - Upgrading from older versions
- **[Production Deployment](https://github.com/waforix/mocha/wiki/Production-Deployment)** - Production-ready configurations

### Reference

- **[API Reference](https://github.com/waforix/mocha/wiki/API-Reference)** - Complete API documentation
- **[Contributing](https://github.com/waforix/mocha/wiki/Contributing)** - How to contribute to the project

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @waforix/mocha

# Using yarn
yarn add @waforix/mocha

# Using bun (recommended)
bun add @waforix/mocha
```

### Basic Setup

```typescript
import { Client } from '@waforix/mocha';

const client = new Client({
  token: 'your-discord-bot-token',
  database: {
    type: 'sqlite',
    path: './data/stats.db'
  }
});

// Wait for client to be ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Start the client
await client.connect();
```

## ✨ Key Features

- **🎯 Modern Discord Bot Framework** - Built with TypeScript and modern Discord API features
- **📊 Advanced Statistics Tracking** - Track messages, voice activity, reactions, and more
- **🔍 Dynamic Autocomplete** - Flexible autocomplete system for slash commands
- **🗄️ Multi-Database Support** - SQLite, PostgreSQL, and MySQL support
- **⚡ High Performance** - Optimized for production use with caching and rate limiting
- **🛠️ Developer Friendly** - Comprehensive TypeScript support and intuitive API
- **📈 Analytics & Insights** - Built-in analytics and data export capabilities
- **🔧 Highly Configurable** - Extensive configuration options for all use cases

## 🏗️ Architecture

@waforix/mocha is built with a modular architecture:

- **Client** - Main client class that orchestrates all functionality
- **Command System** - Slash command builders and handlers
- **Autocomplete System** - Dynamic autocomplete for command options
- **Database Layer** - Multi-database abstraction with migrations
- **Event System** - Comprehensive Discord event tracking
- **Analytics Engine** - Statistics aggregation and insights
- **Cache System** - Intelligent caching for performance
- **Export System** - Data export in multiple formats

## 📋 Requirements

- Node.js 18+ or Bun
- TypeScript 5.0+
- One of: SQLite 3.x, PostgreSQL 12+, or MySQL 8.0+

## 🤝 Community

- **GitHub**: [waforix/mocha](https://github.com/waforix/mocha)
- **Issues**: [Report bugs or request features](https://github.com/waforix/mocha/issues)
- **Discussions**: [Community discussions](https://github.com/waforix/mocha/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/waforix/mocha/blob/main/LICENSE) file for details.

From Waforix, thanks for using Mocha <3
