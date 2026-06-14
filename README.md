<div align="center">

# Arizona Broadcast

### High Performance Multi-Token Discord Broadcasting System

Built with **Node.js** and **discord.js v14**  
Designed for scalability, performance, and reliable workload distribution.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge)
![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge)
![License](https://img.shields.io/badge/Status-Stable-white?style=for-the-badge)

</div>

---

## Overview

Arizona Broadcast is a high-performance Discord broadcasting system designed to handle large scale message delivery using multiple bot tokens.

The system distributes workloads automatically across an available token fleet using intelligent balancing, asynchronous processing, and structured error management.

---

## Features

### Fleet Load Balancing

Automatically manages broadcasting resources:

- Detects available bot tokens
- Handles server member scanning
- Distributes targets between clients
- Balances workload across the fleet

---

### Asynchronous Processing Queue

A controlled queue engine built for efficiency:

- Concurrent task execution
- Parallel direct message handling
- Optimized processing flow
- Rate limit aware execution

---

### Advanced Terminal Logging

Clean runtime monitoring:

- Structured console output
- Delivery status tracking
- Failed request detection
- Gateway and client error reports

---

### Persistent Error Tracking

Reliable state management:

- Stores failed recipients
- Maintains retry data
- Prevents lost broadcast progress

---

### Secure Architecture

Designed with credential protection:

- Environment variable isolation
- Protected token storage
- Source control safety

---

## Project Structure

```txt
Arizona-Broadcast
│
├── index.js
│
├── src/
│   │
│   ├── config.json
│   │
│   ├── managers/
│   │   ├── BotManager.js
│   │   └── BroadcastManager.js
│   │
│   └── utils/
│       ├── queue.js
│       ├── cv2Builder.js
│       ├── logger.js
│       └── storage.js
│
├── .env
└── .gitignore
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Arnoldujr/Discord-Broadcast-Bot.git
cd Discord-Broadcast-Bot
```

Install dependencies:

```bash
npm install
```

Configure environment:

```env
TOKEN_1=
TOKEN_2=
TOKEN_3=
etc...
```

Start application:

```bash
node index.js
```

---

<div align="center">

### Arizona Broadcast

High Performance • Multi Token • Scalable

</div>
