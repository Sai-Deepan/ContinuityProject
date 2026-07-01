const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const mockComponents = [
  {
    id: "COMP-001",
    name: "ESP32-WROOM-32D",
    manufacturer: "Espressif Systems",
    category: "Microcontrollers",
    price: 425,
    stock: 350,
    image: "https://imgs.search.brave.com/5IKQO5Qf-lJ3PVb4gzbIIzu1yzPB5dKTCGSPnAC7b40/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFoZUZzLWgya0wu/anBn",
    description: "Powerful, generic Wi-Fi+BT+BLE MCU module that targets a wide variety of applications, ranging from low-power sensor networks to the most demanding tasks.",
    specifications: JSON.stringify({
      "Core": "Xtensa Dual-Core 32-bit LX6",
      "Operating Voltage": "3.0 V ~ 3.6 V",
      "Flash": "4 MB",
      "Wi-Fi": "802.11 b/g/n",
      "Bluetooth": "v4.2 BR/EDR and BLE"
    }),
    datasheetUrl: "#"
  },
  {
    id: "COMP-002",
    name: "Raspberry Pi Pico",
    manufacturer: "Raspberry Pi Foundation",
    category: "Development Boards",
    price: 380,
    stock: 1200,
    image: "https://imgs.search.brave.com/2i7M5oToHoqTT6rhFuEOjWbVEwcqXxscRal2IaIO9iU/rs:fit:860:0:0:0/g:ce/aHR0cDovL21pY3Jv/Y29udHJvbGxlcnNs/YWIuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzAxL1Jh/c3BiZXJyeS1QaS1Q/aWNvLWRldmVsb3Bt/ZW50LWJvYXJkLmpw/Zw",
    description: "A flexible microcontroller board based on the Raspberry Pi RP2040 microcontroller chip.",
    specifications: JSON.stringify({
      "Chip": "RP2040",
      "Core": "Dual-core ARM Cortex M0+",
      "Clock Speed": "133 MHz",
      "SRAM": "264 KB",
      "Flash": "2 MB"
    }),
    datasheetUrl: "#"
  },
  {
    id: "COMP-003",
    name: "BME280 Environmental Sensor",
    manufacturer: "Adafruit",
    category: "Sensors",
    price: 1415,
    stock: 85,
    image: "https://imgs.search.brave.com/Uc8xyHIIsfq2RuxpC4qDtdqBM4MaYTS_LJc2vJUQmNU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbGVj/dHJpY2FsYnJvLmlu/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzEwL2d5LWJtZTI4/MC1iYXJvbWV0cmlz/Y2hlci1zZW5zb3It/ZnVyLXRlbXBlcmF0/dXItbHVmdGZldWNo/dGlna2VpdC11bmQt/bHVmdGRydWNrLTQz/ODY4OC02MDB4NjAw/LndlYnA",
    description: "Precision sensor from Bosch for measuring barometric pressure, humidity, and temperature.",
    specifications: JSON.stringify({
      "Interface": "I2C/SPI",
      "Voltage": "3.3V / 5V",
      "Temp Accuracy": "±1.0°C",
      "Humidity Accuracy": "±3%",
      "Pressure Range": "300-1100 hPa"
    }),
    datasheetUrl: "#"
  },
  {
    id: "COMP-004",
    name: "LM317 Voltage Regulator",
    manufacturer: "Texas Instruments",
    category: "Power Modules",
    price: 80,
    stock: 5000,
    image: "https://imgs.search.brave.com/2GHLloqjT3U5xz267kehuocG713Jo2-d7jrBEgkS1J4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/ZWxlY21vZHVsZS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIt/MzYucG5n",
    description: "Adjustable 3-terminal positive voltage regulator capable of supplying in excess of 1.5 A over an output voltage range of 1.2 V to 37 V.",
    specifications: JSON.stringify({
      "Output Type": "Adjustable",
      "Output Voltage": "1.2V - 37V",
      "Max Output Current": "1.5A",
      "Package": "TO-220"
    }),
    datasheetUrl: "#"
  },
  {
    id: "COMP-005",
    name: "0.96 inch OLED Display",
    manufacturer: "SparkFun",
    category: "Displays",
    price: 805,
    stock: 210,
    image: "https://imgs.search.brave.com/Cu_xmgUB56EBHh3weZ3eTBAC2Aw2ZUE7geX72AdI1NQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly81Lmlt/aW1nLmNvbS9kYXRh/NS9TRUxMRVIvRGVm/YXVsdC8yMDIxLzcv/RkgvS0YvQlEvODQ5/NzM3NDAvMC05Ni1p/bmNoLWkyYy1paWMt/NHBpbi1vbGVkLWRp/c3BsYXktbW9kdWxl/LWJsdWUtd2l0aG91/dC1zb2xkZXJlZC1w/aW4tNTAweDUwMC5q/cGc",
    description: "Monochrome OLED display with 128x64 resolution and I2C interface.",
    specifications: JSON.stringify({
      "Resolution": "128x64 pixels",
      "Interface": "I2C",
      "Driver": "SSD1306",
      "Color": "White/Blue",
      "Voltage": "3.3V - 5V"
    }),
    datasheetUrl: "#"
  },
  {
    id: "COMP-006",
    name: "Arduino Uno Rev3",
    manufacturer: "Arduino",
    category: "Development Boards",
    price: 2175,
    stock: 430,
    image: "https://imgs.search.brave.com/mauyC5r2Nt1F5zJiakEj1KXfW_0oUxk5k3HfNgfVaMA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cHJheW9naW5kaWEu/aW4vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjAvMDQvOTEtMS5w/bmc",
    description: "Microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header and a reset button.",
    specifications: JSON.stringify({
      "Microcontroller": "ATmega328P",
      "Operating Voltage": "5V",
      "Input Voltage": "7-12V",
      "Digital I/O Pins": "14 (of which 6 provide PWM output)",
      "Analog Input Pins": "6"
    }),
    datasheetUrl: "#"
  }
];

const mockServices = [
  {
    id: "SRV-001",
    title: "Sale of Components",
    description: "Browse our extensive catalog of electronic components. We have everything you need for your next build.",
    iconName: "Package"
  },
  {
    id: "SRV-002",
    title: "Laptop Servicing",
    description: "Professional repair and maintenance for all major laptop brands. Fast turnaround and guaranteed quality.",
    iconName: "Laptop"
  }
];

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    name TEXT,
    manufacturer TEXT,
    category TEXT,
    price REAL,
    stock INTEGER,
    image TEXT,
    description TEXT,
    specifications TEXT,
    datasheetUrl TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    iconName TEXT
  )`);

  // Seed Data if empty
  db.get("SELECT COUNT(*) as count FROM components", (err, row) => {
    if (row && row.count === 0) {
      console.log("Seeding components...");
      const stmt = db.prepare(`INSERT INTO components (id, name, manufacturer, category, price, stock, image, description, specifications, datasheetUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      mockComponents.forEach(c => {
        stmt.run([c.id, c.name, c.manufacturer, c.category, c.price, c.stock, c.image, c.description, c.specifications, c.datasheetUrl]);
      });
      stmt.finalize();
    }
  });

  db.get("SELECT COUNT(*) as count FROM services", (err, row) => {
    if (row && row.count === 0) {
      console.log("Seeding services...");
      const stmt = db.prepare(`INSERT INTO services (id, title, description, iconName) VALUES (?, ?, ?, ?)`);
      mockServices.forEach(s => {
        stmt.run([s.id, s.title, s.description, s.iconName]);
      });
      stmt.finalize();
    }
  });
});

module.exports = db;
