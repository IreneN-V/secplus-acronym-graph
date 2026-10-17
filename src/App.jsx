import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import STUDY_CONTENT from "./studyContent.json";

const PORTS = [
  {
    port: 20,
    proto: "TCP",
    name: "FTP (Data)",
    desc: "File Transfer Protocol — data channel",
    cat: "file",
  },
  {
    port: 21,
    proto: "TCP",
    name: "FTP (Control)",
    desc: "File Transfer Protocol — command channel",
    cat: "file",
  },
  {
    port: 22,
    proto: "TCP",
    name: "SSH / SCP / SFTP",
    desc: "Secure Shell — encrypted remote access & file transfer",
    cat: "remote",
  },
  {
    port: 23,
    proto: "TCP",
    name: "Telnet",
    desc: "Unencrypted remote access — insecure, avoid",
    cat: "remote",
  },
  {
    port: 25,
    proto: "TCP",
    name: "SMTP",
    desc: "Simple Mail Transfer Protocol — sending email",
    cat: "email",
  },
  {
    port: 49,
    proto: "TCP",
    name: "TACACS+",
    desc: "Cisco AAA protocol — encrypts entire payload",
    cat: "auth",
  },
  {
    port: 53,
    proto: "TCP/UDP",
    name: "DNS",
    desc: "Domain Name System — resolves names to IPs",
    cat: "infra",
  },
  {
    port: 67,
    proto: "UDP",
    name: "DHCP (Server)",
    desc: "Dynamic Host Configuration — assigns IPs",
    cat: "infra",
  },
  {
    port: 68,
    proto: "UDP",
    name: "DHCP (Client)",
    desc: "DHCP client side",
    cat: "infra",
  },
  {
    port: 69,
    proto: "UDP",
    name: "TFTP",
    desc: "Trivial FTP — no authentication, used for config/boot",
    cat: "file",
  },
  {
    port: 80,
    proto: "TCP",
    name: "HTTP",
    desc: "Web traffic — unencrypted",
    cat: "web",
  },
  {
    port: 88,
    proto: "TCP/UDP",
    name: "Kerberos",
    desc: "Network authentication protocol — ticket-based",
    cat: "auth",
  },
  {
    port: 110,
    proto: "TCP",
    name: "POP3",
    desc: "Post Office Protocol — downloads & deletes email",
    cat: "email",
  },
  {
    port: 119,
    proto: "TCP",
    name: "NNTP",
    desc: "Network News Transfer Protocol — Usenet",
    cat: "infra",
  },
  {
    port: 123,
    proto: "UDP",
    name: "NTP",
    desc: "Network Time Protocol — clock synchronization",
    cat: "infra",
  },
  {
    port: 135,
    proto: "TCP/UDP",
    name: "RPC",
    desc: "Microsoft Remote Procedure Call endpoint mapper",
    cat: "infra",
  },
  {
    port: 137,
    proto: "TCP/UDP",
    name: "NetBIOS (Name)",
    desc: "NetBIOS name service",
    cat: "infra",
  },
  {
    port: 139,
    proto: "TCP",
    name: "NetBIOS (Session)",
    desc: "NetBIOS session service",
    cat: "infra",
  },
  {
    port: 143,
    proto: "TCP",
    name: "IMAP",
    desc: "Internet Message Access — syncs email, keeps on server",
    cat: "email",
  },
  {
    port: 161,
    proto: "UDP",
    name: "SNMP",
    desc: "Simple Network Management Protocol — queries devices",
    cat: "infra",
  },
  {
    port: 162,
    proto: "UDP",
    name: "SNMP (Trap)",
    desc: "SNMP trap messages — device alerts",
    cat: "infra",
  },
  {
    port: 389,
    proto: "TCP/UDP",
    name: "LDAP",
    desc: "Lightweight Directory Access — unencrypted directory queries",
    cat: "auth",
  },
  {
    port: 443,
    proto: "TCP",
    name: "HTTPS",
    desc: "HTTP over TLS — encrypted web traffic",
    cat: "web",
  },
  {
    port: 445,
    proto: "TCP",
    name: "SMB",
    desc: "Server Message Block — Windows file sharing",
    cat: "file",
  },
  {
    port: 465,
    proto: "TCP",
    name: "SMTPS",
    desc: "SMTP over SSL — encrypted email sending",
    cat: "email",
  },
  {
    port: 514,
    proto: "UDP",
    name: "Syslog",
    desc: "System logging — sends logs to central server",
    cat: "infra",
  },
  {
    port: 587,
    proto: "TCP",
    name: "SMTP (Submission)",
    desc: "SMTP with STARTTLS — modern encrypted email submission",
    cat: "email",
  },
  {
    port: 636,
    proto: "TCP",
    name: "LDAPS",
    desc: "LDAP over SSL/TLS — encrypted directory queries",
    cat: "auth",
  },
  {
    port: 993,
    proto: "TCP",
    name: "IMAPS",
    desc: "IMAP over SSL — encrypted email sync",
    cat: "email",
  },
  {
    port: 995,
    proto: "TCP",
    name: "POP3S",
    desc: "POP3 over SSL — encrypted email download",
    cat: "email",
  },
  {
    port: 1433,
    proto: "TCP",
    name: "MS SQL",
    desc: "Microsoft SQL Server database",
    cat: "infra",
  },
  {
    port: 1701,
    proto: "UDP",
    name: "L2TP",
    desc: "Layer 2 Tunneling Protocol — VPN tunneling, paired with IPSec (no encryption alone)",
    cat: "remote",
  },
  {
    port: 1812,
    proto: "UDP",
    name: "RADIUS (Auth)",
    desc: "RADIUS authentication — AAA for network access",
    cat: "auth",
  },
  {
    port: 1813,
    proto: "UDP",
    name: "RADIUS (Acct)",
    desc: "RADIUS accounting",
    cat: "auth",
  },
  {
    port: 3306,
    proto: "TCP",
    name: "MySQL",
    desc: "MySQL database",
    cat: "infra",
  },
  {
    port: 3389,
    proto: "TCP",
    name: "RDP",
    desc: "Remote Desktop Protocol — Windows GUI remote access",
    cat: "remote",
  },
  {
    port: 5060,
    proto: "TCP/UDP",
    name: "SIP",
    desc: "Session Initiation Protocol — VoIP signaling (unencrypted)",
    cat: "infra",
  },
  {
    port: 5061,
    proto: "TCP",
    name: "SIP (TLS)",
    desc: "SIP over TLS — encrypted VoIP signaling",
    cat: "infra",
  },
  {
    port: 5800,
    proto: "TCP",
    name: "VNC (Web)",
    desc: "Virtual Network Computing over HTTP — browser-based remote desktop",
    cat: "remote",
  },
  {
    port: 5900,
    proto: "TCP",
    name: "VNC",
    desc: "Virtual Network Computing — cross-platform remote desktop access",
    cat: "remote",
  },
  {
    port: 6514,
    proto: "TCP",
    name: "Syslog (TLS)",
    desc: "Syslog over TLS — encrypted logging",
    cat: "infra",
  },
];

const PORT_CAT_COLOR = {
  web: "#185FA5",
  email: "#C2410C",
  file: "#7C3AED",
  remote: "#0F766E",
  auth: "#BE185D",
  infra: "#534AB7",
};
const PORT_CAT_LABEL = {
  web: "Web",
  email: "Email",
  file: "File Transfer",
  remote: "Remote Access",
  auth: "Authentication",
  infra: "Infrastructure",
};

const CAT_COLOR = {
  crypto: "#534AB7",
  network: "#185FA5",
  threats: "#A32D2D",
  identity: "#0F6E56",
  infra: "#BA7517",
  policy: "#993556",
  ops: "#3B6D11",
  cloud: "#5F5E5A",
  osi: "#2A6496",
};

const CAT_LABEL = {
  crypto: "Cryptography",
  network: "Networking",
  threats: "Threats & Attacks",
  identity: "Identity & Access",
  infra: "Infrastructure",
  policy: "Policy & GRC",
  ops: "SecOps / IR",
  cloud: "Cloud",
  osi: "OSI Model",
};

// Cluster centers — tuned to keep all 8 groups inside 700x600
const CLUSTER = {
  crypto: { x: 320, y: 130 },
  network: { x: 650, y: 110 },
  threats: { x: 950, y: 190 },
  identity: { x: 285, y: 350 },
  infra: { x: 690, y: 330 },
  policy: { x: 945, y: 470 },
  ops: { x: 440, y: 525 },
  cloud: { x: 780, y: 535 },
  osi: { x: 60, y: 320 },
};

const NODES = [
  {
    id: "AES",
    cat: "crypto",
    full: "Advanced Encryption Standard",
    desc: "Symmetric block cipher; 128/192/256-bit keys",
  },
  {
    id: "RSA",
    cat: "crypto",
    full: "Rivest–Shamir–Adleman",
    desc: "Asymmetric algorithm using public/private key pair",
  },
  {
    id: "ECC",
    cat: "crypto",
    full: "Elliptic Curve Cryptography",
    desc: "Asymmetric crypto with smaller keys than RSA",
  },
  {
    id: "PKI",
    cat: "crypto",
    full: "Public Key Infrastructure",
    desc: "Framework for managing digital certificates",
  },
  {
    id: "CA",
    cat: "crypto",
    full: "Certificate Authority",
    desc: "Trusted entity that issues digital certificates",
  },
  {
    id: "CRL",
    cat: "crypto",
    full: "Certificate Revocation List",
    desc: "List of revoked certificates published by the CA",
  },
  {
    id: "OCSP",
    cat: "crypto",
    full: "Online Certificate Status Protocol",
    desc: "Real-time certificate validity check",
  },
  {
    id: "SHA",
    cat: "crypto",
    full: "Secure Hash Algorithm",
    desc: "Cryptographic hash family (SHA-256, SHA-512)",
  },
  {
    id: "HMAC",
    cat: "crypto",
    full: "Hash-based MAC",
    desc: "Message integrity using hash + shared secret",
  },
  {
    id: "GCM",
    cat: "crypto",
    full: "Galois/Counter Mode",
    desc: "AES encryption mode providing both encryption and authentication — used in TLS 1.3",
  },
  {
    id: "CTM",
    cat: "crypto",
    full: "Counter Mode (CTR)",
    desc: "Block cipher mode turning block cipher into stream cipher — basis of GCM",
  },
  {
    id: "PEM",
    cat: "crypto",
    full: "Privacy Enhanced Mail",
    desc: "Base64-encoded certificate format (.pem) — used to store keys, certs, and chains",
  },
  {
    id: "GCMP",
    cat: "crypto",
    full: "Galois/Counter Mode Protocol",
    desc: "WPA3 encryption protocol replacing CCMP — uses AES-GCM for stronger security",
  },
  {
    id: "ECB",
    cat: "crypto",
    full: "Electronic Codebook",
    desc: "Simplest block cipher mode — encrypts each block identically; insecure (patterns leak)",
  },
  {
    id: "CBC",
    cat: "crypto",
    full: "Cipher Block Chaining",
    desc: "Each block XORed with previous ciphertext before encryption — needs an IV",
  },
  {
    id: "CFB",
    cat: "crypto",
    full: "Cipher Feedback",
    desc: "Turns a block cipher into a self-synchronizing stream cipher — uses an IV",
  },
  {
    id: "IV",
    cat: "crypto",
    full: "Initialization Vector",
    desc: "Random starting value that makes identical plaintext encrypt differently each time",
  },
  {
    id: "TPM",
    cat: "crypto",
    full: "Trusted Platform Module",
    desc: "Hardware chip for key storage and boot integrity",
  },
  {
    id: "GPG",
    cat: "crypto",
    full: "GNU Privacy Guard",
    desc: "Open-source implementation of PGP — encrypts/signs files and email",
  },
  {
    id: "PGP",
    cat: "crypto",
    full: "Pretty Good Privacy",
    desc: "Email encryption and signing using PKI and symmetric crypto",
  },
  {
    id: "IKE",
    cat: "crypto",
    full: "Internet Key Exchange",
    desc: "Protocol that negotiates and establishes IPSec security associations (SA)",
  },
  {
    id: "DSA",
    cat: "crypto",
    full: "Digital Signature Algorithm",
    desc: "Asymmetric algorithm for digital signatures only (not encryption) — NIST standard",
  },
  {
    id: "PFS",
    cat: "crypto",
    full: "Perfect Forward Secrecy",
    desc: "Generates unique session keys — compromising one key doesn't expose past sessions",
  },
  {
    id: "CER",
    cat: "crypto",
    full: "Crossover Error Rate",
    desc: "Biometric accuracy metric where FAR equals FRR — lower CER = better system",
  },
  {
    id: "EER",
    cat: "crypto",
    full: "Equal Error Rate",
    desc: "Same as CER — point where false accept rate equals false reject rate",
  },
  {
    id: "HSM",
    cat: "crypto",
    full: "Hardware Security Module",
    desc: "Physical device for crypto key management",
  },
  {
    id: "TLS",
    cat: "network",
    full: "Transport Layer Security",
    desc: "Encrypts communications in transit; replaces SSL",
  },
  {
    id: "HTTPS",
    cat: "network",
    full: "HTTP Secure",
    desc: "HTTP over TLS — encrypted web traffic",
  },
  {
    id: "SSH",
    cat: "network",
    full: "Secure Shell",
    desc: "Encrypted protocol for remote command-line access",
  },
  {
    id: "SMTP",
    cat: "network",
    full: "Simple Mail Transfer Protocol",
    desc: "Sends email between servers — port 25; SMTPS adds TLS",
  },
  {
    id: "RDP",
    cat: "network",
    full: "Remote Desktop Protocol",
    desc: "Microsoft GUI remote access — port 3389; encrypt and restrict it",
  },
  {
    id: "VPN",
    cat: "network",
    full: "Virtual Private Network",
    desc: "Encrypted tunnel over an untrusted network",
  },
  {
    id: "IPSec",
    cat: "network",
    full: "Internet Protocol Security",
    desc: "Network-layer encryption suite (AH + ESP)",
  },
  {
    id: "IDS",
    cat: "network",
    full: "Intrusion Detection System",
    desc: "Monitors and alerts on threats — does not block",
  },
  {
    id: "IPS",
    cat: "network",
    full: "Intrusion Prevention System",
    desc: "Actively blocks detected threats in real time",
  },
  {
    id: "WAF",
    cat: "network",
    full: "Web Application Firewall",
    desc: "Filters HTTP traffic to protect web apps",
  },
  {
    id: "VLAN",
    cat: "network",
    full: "Virtual LAN",
    desc: "Logical network segmentation at the switch level",
  },
  {
    id: "LAN",
    cat: "network",
    full: "Local Area Network",
    desc: "Network within a single site — home, office, building",
  },
  {
    id: "WAN",
    cat: "network",
    full: "Wide Area Network",
    desc: "Network spanning large distances/cities — the Internet is the largest WAN",
  },
  {
    id: "WLAN",
    cat: "network",
    full: "Wireless LAN",
    desc: "LAN using Wi-Fi (802.11) instead of cables",
  },
  {
    id: "MAN",
    cat: "network",
    full: "Metropolitan Area Network",
    desc: "Network spanning a city — larger than LAN, smaller than WAN",
  },
  {
    id: "PAN",
    cat: "network",
    full: "Personal Area Network",
    desc: "Very short-range network around one person — Bluetooth, NFC",
  },
  {
    id: "FW",
    cat: "network",
    full: "Firewall",
    desc: "Filters traffic between networks using rules (ACLs) — enforces a security boundary",
  },
  {
    id: "DNSSEC",
    cat: "network",
    full: "DNS Security Extensions",
    desc: "Adds cryptographic authentication to DNS records",
  },
  {
    id: "DDNS",
    cat: "network",
    full: "Dynamic DNS",
    desc: "Auto-updates DNS records when IP changes",
  },
  {
    id: "DHCP",
    cat: "network",
    full: "Dynamic Host Configuration Protocol",
    desc: "Automatically assigns IP addresses to network devices",
  },
  {
    id: "PAC",
    cat: "network",
    full: "Proxy Auto-Configuration",
    desc: "Script that tells browsers which proxy to use for a URL",
  },
  {
    id: "WEP",
    cat: "network",
    full: "Wired Equivalent Privacy",
    desc: "Original Wi-Fi encryption — broken, do not use",
  },
  {
    id: "WPA",
    cat: "network",
    full: "Wi-Fi Protected Access",
    desc: "Replaced WEP; uses TKIP — also considered weak now",
  },
  {
    id: "WPA2",
    cat: "network",
    full: "Wi-Fi Protected Access 2",
    desc: "Current standard; uses AES-CCMP for strong encryption",
  },
  {
    id: "WPS",
    cat: "network",
    full: "Wi-Fi Protected Setup",
    desc: "Easy device pairing feature — vulnerable to PIN brute-force",
  },
  {
    id: "TCP",
    cat: "network",
    full: "Transmission Control Protocol",
    desc: "Reliable, connection-oriented transport protocol",
  },
  {
    id: "UDP",
    cat: "network",
    full: "User Datagram Protocol",
    desc: "Fast, connectionless transport — no delivery guarantee",
  },
  {
    id: "DNS",
    cat: "network",
    full: "Domain Name System",
    desc: "Translates domain names into IP addresses",
  },
  {
    id: "SCP",
    cat: "network",
    full: "Secure Copy Protocol",
    desc: "Securely transfers files over SSH",
  },
  {
    id: "RAS",
    cat: "network",
    full: "Remote Access Service",
    desc: "Provides remote connectivity to a network (predecessor to modern VPN)",
  },
  {
    id: "TTLS",
    cat: "network",
    full: "Tunneled Transport Layer Security",
    desc: "EAP-TTLS: extends TLS for Wi-Fi/RADIUS authentication",
  },
  {
    id: "PPTP",
    cat: "network",
    full: "Point-to-Point Tunneling Protocol",
    desc: "Old VPN protocol operating at L5 Session layer — considered insecure, replaced by L2TP/IPSec",
  },
  {
    id: "NetBIOS",
    cat: "network",
    full: "Network Basic Input/Output System",
    desc: "Session-layer API for legacy Windows networking and name resolution",
  },
  {
    id: "RPC",
    cat: "network",
    full: "Remote Procedure Call",
    desc: "Session-layer mechanism for executing code on remote systems",
  },
  {
    id: "API",
    cat: "network",
    full: "Application Programming Interface",
    desc: "Interface allowing systems to communicate — secured via keys, OAuth, TLS",
  },
  {
    id: "ICMP",
    cat: "network",
    full: "Internet Control Message Protocol",
    desc: "Used for diagnostics (ping, traceroute) and error reporting — operates at L3",
  },
  {
    id: "NAT",
    cat: "network",
    full: "Network Address Translation",
    desc: "Maps private IP addresses to a public IP — hides internal network structure",
  },
  {
    id: "PAT",
    cat: "network",
    full: "Port Address Translation",
    desc: "NAT variant that maps multiple private IPs to one public IP using different ports (also called NAT overload)",
  },
  {
    id: "SFTP",
    cat: "network",
    full: "SSH File Transfer Protocol",
    desc: "Secure file transfer over SSH tunnel — uses port 22",
  },
  {
    id: "FTP",
    cat: "network",
    full: "File Transfer Protocol",
    desc: "Unencrypted file transfer protocol — insecure, replace with SFTP or FTPS",
  },
  {
    id: "FTPS",
    cat: "network",
    full: "FTP Secure",
    desc: "FTP over TLS/SSL — explicit (port 21) or implicit (port 990)",
  },
  {
    id: "BGP",
    cat: "network",
    full: "Border Gateway Protocol",
    desc: "Internet's core routing protocol — manages traffic between autonomous systems",
  },
  {
    id: "L2TP",
    cat: "network",
    full: "Layer 2 Tunneling Protocol",
    desc: "VPN tunneling protocol — provides no encryption itself, paired with IPSec for security",
  },
  {
    id: "SMTPS",
    cat: "network",
    full: "SMTP Secure",
    desc: "SMTP over TLS/SSL — encrypts email in transit on port 465 or 587",
  },
  {
    id: "NTP",
    cat: "network",
    full: "Network Time Protocol",
    desc: "Synchronizes clocks across devices — port 123; critical for logs/Kerberos",
  },
  {
    id: "SNMP",
    cat: "network",
    full: "Simple Network Management Protocol",
    desc: "Monitors and manages network devices — port 161/162; v3 adds encryption",
  },
  {
    id: "NNTP",
    cat: "network",
    full: "Network News Transfer Protocol",
    desc: "Transfers Usenet newsgroup articles — port 119",
  },
  {
    id: "TFTP",
    cat: "network",
    full: "Trivial File Transfer Protocol",
    desc: "Lightweight UDP file transfer with no authentication — port 69; used for boot/config",
  },
  {
    id: "RDS",
    cat: "network",
    full: "Remote Desktop Services",
    desc: "Microsoft service providing RDP-based remote sessions — uses port 3389",
  },
  {
    id: "SOAP",
    cat: "network",
    full: "Simple Object Access Protocol",
    desc: "XML-based messaging protocol for web services — more rigid than REST",
  },
  {
    id: "SVC",
    cat: "network",
    full: "Switched Virtual Circuit",
    desc: "Temporary on-demand logical connection set up per session (vs permanent PVC)",
  },
  {
    id: "DCS",
    cat: "network",
    full: "Distributed Control System",
    desc: "Industrial control system for process automation across a plant — OT/ICS environment",
  },
  {
    id: "MIB",
    cat: "network",
    full: "Management Information Base",
    desc: "Hierarchical database of objects that SNMP can query/set on a managed device",
  },
  {
    id: "NMS",
    cat: "network",
    full: "Network Management System",
    desc: "Central platform that monitors and manages devices via SNMP — reads the MIB",
  },
  {
    id: "SIP",
    cat: "network",
    full: "Session Initiation Protocol",
    desc: "Sets up, manages, and tears down VoIP/video calls — port 5060 (5061 with TLS)",
  },
  {
    id: "OID",
    cat: "network",
    full: "Object Identifier",
    desc: "Unique dotted-number address identifying a specific object in an SNMP MIB tree",
  },
  {
    id: "SPD",
    cat: "network",
    full: "Security Policy Database",
    desc: "IPSec component that defines which traffic gets encrypted, bypassed, or dropped",
  },
  {
    id: "EAP",
    cat: "network",
    full: "Extensible Authentication Protocol",
    desc: "Authentication framework used in 802.1X Wi-Fi and VPN — supports many methods (EAP-TLS, EAP-TTLS)",
  },
  {
    id: "DKIM",
    cat: "network",
    full: "DomainKeys Identified Mail",
    desc: "Email authentication using digital signatures — verifies sender domain hasn't been spoofed",
  },
  {
    id: "SPF",
    cat: "network",
    full: "Sender Policy Framework",
    desc: "Email authentication that specifies which mail servers are allowed to send on behalf of a domain",
  },
  {
    id: "DMARC",
    cat: "network",
    full: "Domain-based Message Authentication, Reporting & Conformance",
    desc: "Email policy layer on top of SPF + DKIM — tells servers what to do if checks fail (quarantine/reject)",
  },
  {
    id: "DMAC",
    cat: "network",
    full: "Destination MAC Address",
    desc: "Layer 2 address identifying the target device in an Ethernet frame",
  },
  {
    id: "AH",
    cat: "network",
    full: "Authentication Header",
    desc: "IPSec protocol that provides integrity and authentication (no encryption)",
  },
  {
    id: "ESP",
    cat: "network",
    full: "Encapsulating Security Payload",
    desc: "IPSec protocol that provides encryption + integrity",
  },
  {
    id: "CRS",
    cat: "network",
    full: "OWASP Core Rule Set",
    desc: "Default ruleset for WAFs — blocks common attacks (SQLi, XSS, etc.)",
  },
  {
    id: "SWG",
    cat: "network",
    full: "Secure Web Gateway",
    desc: "Filters outbound web traffic; enforces policy and blocks threats",
  },
  {
    id: "APT",
    cat: "threats",
    full: "Advanced Persistent Threat",
    desc: "Long-term targeted attack by a sophisticated actor",
  },
  {
    id: "DDoS",
    cat: "threats",
    full: "Distributed Denial of Service",
    desc: "Floods a target from many sources simultaneously",
  },
  {
    id: "MITM",
    cat: "threats",
    full: "Man-in-the-Middle",
    desc: "Intercepts communication between two parties",
  },
  {
    id: "XSS",
    cat: "threats",
    full: "Cross-Site Scripting",
    desc: "Injects malicious scripts into web pages",
  },
  {
    id: "SQLi",
    cat: "threats",
    full: "SQL Injection",
    desc: "Exploits unsanitized database queries",
  },
  {
    id: "CVE",
    cat: "threats",
    full: "Common Vulnerabilities & Exposures",
    desc: "Public database of known security vulnerabilities",
  },
  {
    id: "CVSS",
    cat: "threats",
    full: "Common Vulnerability Scoring System",
    desc: "Rates vulnerability severity from 0 to 10",
  },
  {
    id: "C2",
    cat: "threats",
    full: "Command & Control",
    desc: "Attacker-controlled server for managing malware",
  },
  {
    id: "IoC",
    cat: "threats",
    full: "Indicator of Compromise",
    desc: "Evidence artifact suggesting a system was breached",
  },
  {
    id: "RAT",
    cat: "threats",
    full: "Remote Access Trojan",
    desc: "Malware giving an attacker covert remote control of a victim machine (e.g. NanoCore)",
  },
  {
    id: "TTPs",
    cat: "threats",
    full: "Tactics, Techniques & Procedures",
    desc: "Attacker behavior patterns (MITRE ATT&CK)",
  },
  {
    id: "PUP",
    cat: "threats",
    full: "Potentially Unwanted Program",
    desc: "Software that may be unwanted despite user consent — adware, toolbars, bundled software",
  },
  {
    id: "SEH",
    cat: "threats",
    full: "Structured Exception Handler",
    desc: "Windows error-handling mechanism — exploited in SEH-based buffer overflow attacks",
  },
  {
    id: "MFA",
    cat: "identity",
    full: "Multi-Factor Authentication",
    desc: "Requires 2+ independent authentication factors",
  },
  {
    id: "SSO",
    cat: "identity",
    full: "Single Sign-On",
    desc: "One login grants access to multiple systems",
  },
  {
    id: "SAML",
    cat: "identity",
    full: "Security Assertion Markup Language",
    desc: "XML standard for federated authentication",
  },
  {
    id: "OAuth",
    cat: "identity",
    full: "Open Authorization",
    desc: "Delegated access without sharing credentials",
  },
  {
    id: "OIDC",
    cat: "identity",
    full: "OpenID Connect",
    desc: "Identity layer built on top of OAuth 2.0",
  },
  {
    id: "LDAP",
    cat: "identity",
    full: "Lightweight Directory Access Protocol",
    desc: "Queries directory services like Active Directory",
  },
  {
    id: "RADIUS",
    cat: "identity",
    full: "Remote Authentication Dial-In User Service",
    desc: "Centralized network authentication (AAA)",
  },
  {
    id: "RBAC",
    cat: "identity",
    full: "Role-Based Access Control",
    desc: "Permissions assigned through roles",
  },
  {
    id: "IAM",
    cat: "identity",
    full: "Identity & Access Management",
    desc: "Manages digital identities and access rights",
  },
  {
    id: "PAM",
    cat: "identity",
    full: "Privileged Access Management",
    desc: "Controls and audits privileged accounts",
  },
  {
    id: "TOTP",
    cat: "identity",
    full: "Time-based One-Time Password",
    desc: "Time-synced OTP (e.g., Google Authenticator)",
  },
  {
    id: "TACACS+",
    cat: "identity",
    full: "Terminal Access Controller Access-Control System Plus",
    desc: "AAA protocol for network device authentication; separates auth/authz/accounting",
  },
  {
    id: "KDC",
    cat: "identity",
    full: "Key Distribution Center",
    desc: "Core Kerberos component — issues tickets; contains AS and TGS",
  },
  {
    id: "Kerberos",
    cat: "identity",
    full: "Kerberos",
    desc: "Ticket-based network authentication protocol — port 88; uses a KDC, time-sensitive",
  },
  {
    id: "TACACS",
    cat: "identity",
    full: "TACACS+",
    desc: "Cisco AAA protocol — encrypts the entire payload, separates authentication/authorization (vs RADIUS)",
  },
  {
    id: "TGT",
    cat: "identity",
    full: "Ticket Granting Ticket",
    desc: "Kerberos token issued by AS after login — used to request service tickets",
  },
  {
    id: "TGS",
    cat: "identity",
    full: "Ticket Granting Service",
    desc: "Kerberos component inside KDC — issues Service Tickets upon TGT presentation",
  },
  {
    id: "AS",
    cat: "identity",
    full: "Authentication Service",
    desc: "Kerberos component that verifies credentials and issues the TGT",
  },
  {
    id: "ST",
    cat: "identity",
    full: "Service Ticket",
    desc: "Kerberos ticket granting access to a specific service — issued by TGS",
  },
  {
    id: "SAE",
    cat: "identity",
    full: "Simultaneous Authentication of Equals",
    desc: "WPA3 key exchange replacing PSK — resistant to offline dictionary attacks",
  },
  {
    id: "ABAC",
    cat: "identity",
    full: "Attribute-Based Access Control",
    desc: "Access granted based on user/resource attributes and policies — more flexible than RBAC",
  },
  {
    id: "UAC",
    cat: "identity",
    full: "User Account Control",
    desc: "Windows security feature that prompts for elevation before running privileged operations",
  },
  {
    id: "RuBAC",
    cat: "identity",
    full: "Rule-Based Access Control",
    desc: "Access decided by system-enforced rules (e.g. firewall ACLs, time-of-day) — not identity",
  },
  {
    id: "AAA",
    cat: "identity",
    full: "Authentication, Authorization & Accounting",
    desc: "Framework: verify identity, grant permissions, log activity — RADIUS/TACACS+ implement it",
  },
  {
    id: "ACL",
    cat: "identity",
    full: "Access Control List",
    desc: "Ordered list of permit/deny rules controlling access to resources or network traffic",
  },
  {
    id: "FRR",
    cat: "identity",
    full: "False Rejection Rate",
    desc: "Biometric metric: rate at which legitimate users are incorrectly denied — paired with FAR",
  },
  {
    id: "NGFW",
    cat: "infra",
    full: "Next-Generation Firewall",
    desc: "Firewall + DPI + IPS + app and user awareness",
  },
  {
    id: "DPI",
    cat: "infra",
    full: "Deep Packet Inspection",
    desc: "Examines the full packet payload (not just headers) to detect malware, apps, and policy violations",
  },
  {
    id: "DMZ",
    cat: "infra",
    full: "Demilitarized Zone",
    desc: "Network segment between the internet and LAN",
  },
  {
    id: "DLP",
    cat: "infra",
    full: "Data Loss Prevention",
    desc: "Prevents unauthorized exfiltration of sensitive data",
  },
  {
    id: "NAC",
    cat: "infra",
    full: "Network Access Control",
    desc: "Checks device health before granting network access",
  },
  {
    id: "ZTNA",
    cat: "infra",
    full: "Zero Trust Network Access",
    desc: "Verify always — never trust the network implicitly",
  },
  {
    id: "MDM",
    cat: "infra",
    full: "Mobile Device Management",
    desc: "Centrally manages and secures mobile devices",
  },
  {
    id: "SCADA",
    cat: "infra",
    full: "Supervisory Control & Data Acquisition",
    desc: "Monitors and controls industrial processes",
  },
  {
    id: "ICS",
    cat: "infra",
    full: "Industrial Control System",
    desc: "Systems managing industrial/critical infrastructure",
  },
  {
    id: "PLC",
    cat: "infra",
    full: "Programmable Logic Controller",
    desc: "Ruggedized industrial computer controlling machinery — core component of ICS/OT",
  },
  {
    id: "RTU",
    cat: "infra",
    full: "Remote Terminal Unit",
    desc: "Field device collecting sensor data and relaying it to SCADA over long distances",
  },
  {
    id: "RFID",
    cat: "infra",
    full: "Radio Frequency Identification",
    desc: "Wireless tags read by radio — used for badges, asset tracking; can be cloned/skimmed",
  },
  {
    id: "UTM",
    cat: "infra",
    full: "Unified Threat Management",
    desc: "All-in-one appliance: firewall + IDS/IPS + AV + more",
  },
  {
    id: "UPS",
    cat: "infra",
    full: "Uninterruptible Power Supply",
    desc: "Battery backup that keeps systems running during power failure",
  },
  {
    id: "SED",
    cat: "infra",
    full: "Self-Encrypting Drive",
    desc: "Storage drive with built-in AES encryption — encrypts data automatically without OS involvement",
  },
  {
    id: "UEFI",
    cat: "infra",
    full: "Unified Extensible Firmware Interface",
    desc: "Modern BIOS replacement — supports Secure Boot, preventing unsigned OS from loading",
  },
  {
    id: "ESG",
    cat: "infra",
    full: "Email Security Gateway",
    desc: "Filters inbound/outbound email — blocks spam, phishing, malware, and enforces DLP",
  },
  {
    id: "PSU",
    cat: "infra",
    full: "Power Supply Unit",
    desc: "Converts AC to DC power for computer components",
  },
  {
    id: "PDU",
    cat: "infra",
    full: "Power Distribution Unit",
    desc: "Distributes power to multiple devices in a rack/datacenter",
  },
  {
    id: "RAID0",
    cat: "infra",
    full: "RAID Level 0 — Striping",
    desc: "Splits data across drives for speed; NO redundancy — total failure if one drive fails",
  },
  {
    id: "RAID1",
    cat: "infra",
    full: "RAID Level 1 — Mirroring",
    desc: "Exact copy on two drives; survives one drive failure",
  },
  {
    id: "RAID5",
    cat: "infra",
    full: "RAID Level 5 — Striping with Parity",
    desc: "Distributed parity across 3+ drives; survives one drive failure",
  },
  {
    id: "RAID6",
    cat: "infra",
    full: "RAID Level 6 — Striping with Double Parity",
    desc: "Double distributed parity across 4+ drives; survives TWO simultaneous drive failures",
  },
  {
    id: "RAID10",
    cat: "infra",
    full: "RAID Level 10 — Mirror + Stripe",
    desc: "Combines RAID 1 and RAID 0; fast and redundant, needs 4+ drives",
  },
  {
    id: "HOT",
    cat: "infra",
    full: "Hot Site",
    desc: "Fully operational backup facility — failover in minutes",
  },
  {
    id: "WARM",
    cat: "infra",
    full: "Warm Site",
    desc: "Partially equipped backup site — hours to bring online",
  },
  {
    id: "COLD",
    cat: "infra",
    full: "Cold Site",
    desc: "Empty facility with power/network only — days/weeks to activate",
  },
  {
    id: "RTOS",
    cat: "infra",
    full: "Real-Time Operating System",
    desc: "OS designed for deterministic, time-critical tasks (used in ICS/OT)",
  },
  {
    id: "ASLR",
    cat: "infra",
    full: "Address Space Layout Randomization",
    desc: "OS security technique that randomizes memory addresses to prevent exploits",
  },
  {
    id: "SCAP",
    cat: "infra",
    full: "Security Content Automation Protocol",
    desc: "NIST framework for automating vulnerability management and compliance checking",
  },
  {
    id: "SDN",
    cat: "infra",
    full: "Software-Defined Networking",
    desc: "Centralizes network control via software, decoupling it from hardware",
  },
  {
    id: "SD-WAN",
    cat: "infra",
    full: "Software-Defined Wide Area Network",
    desc: "Software-managed WAN; core transport component of SASE",
  },
  {
    id: "FWaaS",
    cat: "cloud",
    full: "Firewall as a Service",
    desc: "Cloud-delivered firewall — SASE component replacing on-prem perimeter FW",
  },
  {
    id: "PaaS",
    cat: "cloud",
    full: "Platform as a Service",
    desc: "Cloud platform for app development — no infra management needed",
  },
  {
    id: "SASE",
    cat: "cloud",
    full: "Secure Access Service Edge",
    desc: "Converged cloud security framework: SD-WAN + CASB + ZTNA + FWaaS + SWG",
  },
  {
    id: "BCP",
    cat: "policy",
    full: "Business Continuity Plan",
    desc: "Maintains operations during a disruptive event",
  },
  {
    id: "DRP",
    cat: "policy",
    full: "Disaster Recovery Plan",
    desc: "Restores IT systems after a disaster",
  },
  {
    id: "RPO",
    cat: "policy",
    full: "Recovery Point Objective",
    desc: "Max acceptable data loss measured in time",
  },
  {
    id: "RTO",
    cat: "policy",
    full: "Recovery Time Objective",
    desc: "Max acceptable downtime before restoration",
  },
  {
    id: "GRC",
    cat: "policy",
    full: "Governance, Risk & Compliance",
    desc: "Aligns security with business and regulatory goals",
  },
  {
    id: "SDLM",
    cat: "policy",
    full: "Software Development Lifecycle Methodology",
    desc: "Structured process for building software (Waterfall, Agile) — security built in at each phase",
  },
  {
    id: "SDLS",
    cat: "policy",
    full: "Software Development Lifecycle Security",
    desc: "Embedding security checks (threat modeling, code review, testing) into each SDLC phase",
  },
  {
    id: "RAD",
    cat: "policy",
    full: "Rapid Application Development",
    desc: "SDLC model emphasizing fast prototyping and iteration over heavy upfront planning",
  },
  {
    id: "PII",
    cat: "policy",
    full: "Personally Identifiable Information",
    desc: "Any data that can identify a specific individual",
  },
  {
    id: "PHI",
    cat: "policy",
    full: "Protected Health Information",
    desc: "Medical data protected under HIPAA — any health info tied to a person",
  },
  {
    id: "GDPR",
    cat: "policy",
    full: "General Data Protection Regulation",
    desc: "EU regulation governing personal data protection",
  },
  {
    id: "HIPAA",
    cat: "policy",
    full: "Health Insurance Portability and Accountability Act",
    desc: "US law protecting medical data privacy",
  },
  {
    id: "NIST",
    cat: "policy",
    full: "Natl. Institute of Standards & Technology",
    desc: "Publishes cybersecurity frameworks (SP 800 series)",
  },
  {
    id: "SOW",
    cat: "policy",
    full: "Statement of Work",
    desc: "Document defining scope, deliverables, and timeline for a project",
  },
  {
    id: "COOP",
    cat: "policy",
    full: "Continuity of Operations Plan",
    desc: "Government/org plan to maintain essential functions during a crisis",
  },
  {
    id: "MTTF",
    cat: "policy",
    full: "Mean Time to Failure",
    desc: "Average time a device runs before it permanently fails",
  },
  {
    id: "MTTR",
    cat: "policy",
    full: "Mean Time to Repair/Recover",
    desc: "Average time to restore a system after failure — lower is better",
  },
  {
    id: "MTBF",
    cat: "policy",
    full: "Mean Time Between Failures",
    desc: "Average time between recoverable failures: MTBF = MTTF + MTTR",
  },
  {
    id: "MOU",
    cat: "policy",
    full: "Memorandum of Understanding",
    desc: "Non-binding agreement between two parties defining intent to work together",
  },
  {
    id: "ARO",
    cat: "policy",
    full: "Annualized Rate of Occurrence",
    desc: "Estimated frequency a threat will occur within a year — used in risk calculations",
  },
  {
    id: "ALE",
    cat: "policy",
    full: "Annualized Loss Expectancy",
    desc: "Expected yearly loss: ALE = SLE × ARO — core metric in quantitative risk analysis",
  },
  {
    id: "SLE",
    cat: "policy",
    full: "Single Loss Expectancy",
    desc: "Expected loss from a single incident: SLE = Asset Value × Exposure Factor",
  },
  {
    id: "AV",
    cat: "policy",
    full: "Asset Value",
    desc: "Monetary worth of an asset — the AV in SLE = AV × EF",
  },
  {
    id: "BPA",
    cat: "policy",
    full: "Business Partnership Agreement",
    desc: "Formal legal agreement outlining roles and responsibilities between partners",
  },
  {
    id: "MSA",
    cat: "policy",
    full: "Master Service Agreement",
    desc: "Overarching contract defining terms for all future work between two parties",
  },
  {
    id: "TOCTOU",
    cat: "threats",
    full: "Time of Check to Time of Use",
    desc: "Race condition attack exploiting the gap between validating and using a resource",
  },
  {
    id: "SLA",
    cat: "policy",
    full: "Service Level Agreement",
    desc: "Contract defining expected uptime, performance, and support response",
  },
  {
    id: "BIA",
    cat: "policy",
    full: "Business Impact Analysis",
    desc: "Identifies critical systems and quantifies impact of disruption — foundation of BCP/DRP",
  },
  {
    id: "ISO",
    cat: "policy",
    full: "International Organization for Standardization",
    desc: "Publishes security standards like ISO 27001 (ISMS) and 27002 (controls)",
  },
  {
    id: "EF",
    cat: "policy",
    full: "Exposure Factor",
    desc: "Percentage of asset value lost in a single incident — used in SLE = AV × EF",
  },
  {
    id: "GLBA",
    cat: "policy",
    full: "Gramm-Leach-Bliley Act",
    desc: "US law requiring financial institutions to protect customer financial data",
  },
  {
    id: "EULA",
    cat: "policy",
    full: "End User License Agreement",
    desc: "Legal contract between software vendor and user governing how software may be used",
  },
  {
    id: "AUP",
    cat: "policy",
    full: "Acceptable Use Policy",
    desc: "Defines what users may and may not do with company systems and data",
  },
  {
    id: "SIEM",
    cat: "ops",
    full: "Security Info & Event Management",
    desc: "Aggregates and correlates logs for threat detection",
  },
  {
    id: "SOC",
    cat: "ops",
    full: "Security Operations Center",
    desc: "Team monitoring and responding to threats 24/7",
  },
  {
    id: "SOAR",
    cat: "ops",
    full: "Security Orchestration & Automation",
    desc: "Automates incident detection and response",
  },
  {
    id: "EDR",
    cat: "ops",
    full: "Endpoint Detection & Response",
    desc: "Monitors endpoints and enables rapid response",
  },
  {
    id: "XDR",
    cat: "ops",
    full: "Extended Detection & Response",
    desc: "EDR extended with network, cloud, and email data",
  },
  {
    id: "IR",
    cat: "ops",
    full: "Incident Response",
    desc: "Structured process: detect → contain → recover",
  },
  {
    id: "UEBA",
    cat: "ops",
    full: "User & Entity Behavior Analytics",
    desc: "Detects anomalous user and device behavior",
  },
  {
    id: "AIS",
    cat: "ops",
    full: "Automated Indicator Sharing",
    desc: "CISA program for real-time sharing of cyber threat indicators between organizations",
  },
  {
    id: "TAXII",
    cat: "ops",
    full: "Trusted Automated eXchange of Intelligence Information",
    desc: "Transport protocol for sharing CTI over HTTPS — works alongside STIX",
  },
  {
    id: "STIX",
    cat: "ops",
    full: "Structured Threat Information eXpression",
    desc: "Standardized language/format for describing cyber threat intelligence — paired with TAXII",
  },
  {
    id: "NVD",
    cat: "ops",
    full: "National Vulnerability Database",
    desc: "NIST database of CVEs enriched with severity scores (CVSS) and remediation data",
  },
  {
    id: "VM",
    cat: "cloud",
    full: "Virtual Machine",
    desc: "Software emulation of a physical computer",
  },
  {
    id: "VDI",
    cat: "cloud",
    full: "Virtual Desktop Infrastructure",
    desc: "Centrally hosted and managed desktop environments",
  },
  {
    id: "IaaS",
    cat: "cloud",
    full: "Infrastructure as a Service",
    desc: "Cloud compute, storage, and networking on demand",
  },
  {
    id: "SaaS",
    cat: "cloud",
    full: "Software as a Service",
    desc: "Software delivered via browser subscription",
  },
  {
    id: "CASB",
    cat: "cloud",
    full: "Cloud Access Security Broker",
    desc: "Security intermediary between users and cloud services",
  },
  {
    id: "MSSP",
    cat: "cloud",
    full: "Managed Security Service Provider",
    desc: "Outsourced security monitoring and management",
  },
  {
    id: "L7",
    cat: "osi",
    full: "Application Layer",
    desc: "User-facing protocols: HTTP, DNS, SMTP, SSH, FTP",
  },
  {
    id: "L6",
    cat: "osi",
    full: "Presentation Layer",
    desc: "Encryption, encoding, compression (TLS lives here)",
  },
  {
    id: "L5",
    cat: "osi",
    full: "Session Layer",
    desc: "Manages sessions between applications",
  },
  {
    id: "L4",
    cat: "osi",
    full: "Transport Layer",
    desc: "End-to-end delivery: TCP, UDP, ports",
  },
  {
    id: "L3",
    cat: "osi",
    full: "Network Layer",
    desc: "IP routing, logical addressing, packet forwarding",
  },
  {
    id: "L2",
    cat: "osi",
    full: "Data Link Layer",
    desc: "MAC addresses, switches, frames, VLANs",
  },
  {
    id: "L1",
    cat: "osi",
    full: "Physical Layer",
    desc: "Cables, signals, wireless radio (Wi-Fi hardware)",
  },
];

const LINKS = [
  { source: "PKI", target: "CA", label: "managed by" },
  { source: "CA", target: "CRL", label: "publishes" },
  { source: "CA", target: "OCSP", label: "responds via" },
  { source: "PKI", target: "CRL", label: "uses" },
  { source: "PKI", target: "OCSP", label: "uses" },
  { source: "TLS", target: "PKI", label: "relies on" },
  { source: "TLS", target: "AES", label: "uses" },
  { source: "TLS", target: "RSA", label: "key exchange via" },
  { source: "HMAC", target: "SHA", label: "uses" },
  { source: "GCM", target: "AES", label: "mode of" },
  { source: "CTM", target: "AES", label: "mode of" },
  { source: "GCM", target: "CTM", label: "extends" },
  { source: "CTM", target: "TLS", label: "used in" },
  { source: "GCM", target: "TLS", label: "used in" },
  { source: "GCM", target: "HMAC", label: "alternative to" },
  { source: "HSM", target: "PKI", label: "stores keys for" },
  { source: "TPM", target: "PKI", label: "supports" },
  { source: "HTTPS", target: "TLS", label: "uses" },
  { source: "SSH", target: "AES", label: "encrypts via" },
  { source: "VPN", target: "IPSec", label: "can use" },
  { source: "VPN", target: "TLS", label: "SSL VPN uses" },
  { source: "IPS", target: "IDS", label: "extends" },
  { source: "NGFW", target: "IPS", label: "includes" },
  { source: "NGFW", target: "DMZ", label: "protects" },
  { source: "WAF", target: "XSS", label: "defends against" },
  { source: "WAF", target: "SQLi", label: "defends against" },
  { source: "DMZ", target: "VLAN", label: "uses" },
  { source: "IDS", target: "SIEM", label: "feeds into" },
  { source: "APT", target: "C2", label: "uses" },
  { source: "APT", target: "TTPs", label: "defined by" },
  { source: "APT", target: "IoC", label: "leaves" },
  { source: "CVE", target: "CVSS", label: "scored by" },
  { source: "IoC", target: "SIEM", label: "detected by" },
  { source: "MITM", target: "TLS", label: "mitigated by" },
  { source: "MFA", target: "TOTP", label: "uses" },
  { source: "MFA", target: "RADIUS", label: "enforced via" },
  { source: "SSO", target: "SAML", label: "uses" },
  { source: "SSO", target: "OIDC", label: "uses" },
  { source: "OIDC", target: "OAuth", label: "built on" },
  { source: "LDAP", target: "IAM", label: "feeds into" },
  { source: "RBAC", target: "IAM", label: "part of" },
  { source: "PAM", target: "IAM", label: "subset of" },
  { source: "ZTNA", target: "IAM", label: "relies on" },
  { source: "RADIUS", target: "MFA", label: "can enforce" },
  { source: "NAC", target: "MDM", label: "works with" },
  { source: "ICS", target: "SCADA", label: "includes" },
  { source: "DLP", target: "SIEM", label: "alerts to" },
  { source: "NGFW", target: "DMZ", label: "protects" },
  { source: "BCP", target: "DRP", label: "includes" },
  { source: "BCP", target: "RPO", label: "defines" },
  { source: "BCP", target: "RTO", label: "defines" },
  { source: "DRP", target: "RPO", label: "bounded by" },
  { source: "DRP", target: "RTO", label: "bounded by" },
  { source: "GDPR", target: "PII", label: "protects" },
  { source: "HIPAA", target: "PII", label: "protects" },
  { source: "GRC", target: "BCP", label: "governs" },
  { source: "GRC", target: "NIST", label: "references" },
  { source: "SIEM", target: "SOC", label: "used by" },
  { source: "SOAR", target: "SIEM", label: "integrates with" },
  { source: "SOAR", target: "IR", label: "automates" },
  { source: "SOC", target: "IR", label: "executes" },
  { source: "XDR", target: "EDR", label: "extends" },
  { source: "XDR", target: "SIEM", label: "feeds into" },
  { source: "UEBA", target: "SIEM", label: "feeds into" },
  { source: "EDR", target: "SIEM", label: "feeds into" },
  { source: "MSSP", target: "SOC", label: "provides" },
  { source: "MSSP", target: "SIEM", label: "manages" },
  { source: "VDI", target: "VM", label: "uses" },
  { source: "IaaS", target: "VM", label: "provides" },
  { source: "CASB", target: "SaaS", label: "secures" },
  { source: "CASB", target: "IaaS", label: "secures" },
  { source: "DDNS", target: "DNSSEC", label: "secured by" },
  { source: "DDNS", target: "DHCP", label: "triggered by" },
  { source: "PAC", target: "VPN", label: "alt/complement to" },
  { source: "PAC", target: "HTTPS", label: "routes traffic via" },
  { source: "WPA", target: "WEP", label: "replaces" },
  { source: "WPA2", target: "WPA", label: "improves on" },
  { source: "WPA2", target: "AES", label: "uses" },
  { source: "WPS", target: "WPA2", label: "pairs devices via" },
  { source: "UTM", target: "IPS", label: "includes" },
  { source: "UTM", target: "WAF", label: "includes" },
  { source: "NGFW", target: "UTM", label: "evolved from" },
  { source: "L7", target: "L6", label: "above" },
  { source: "L6", target: "L5", label: "above" },
  { source: "L5", target: "L4", label: "above" },
  { source: "L4", target: "L3", label: "above" },
  { source: "L3", target: "L2", label: "above" },
  { source: "L2", target: "L1", label: "above" },
  { source: "HTTPS", target: "L7", label: "operates at" },
  { source: "SSH", target: "L7", label: "operates at" },
  { source: "LDAP", target: "L7", label: "operates at" },
  { source: "DNS", target: "L7", label: "operates at" },
  { source: "SCP", target: "L7", label: "operates at" },
  { source: "TLS", target: "L6", label: "operates at" },
  { source: "TTLS", target: "L6", label: "operates at" },
  { source: "TCP", target: "L4", label: "operates at" },
  { source: "UDP", target: "L4", label: "operates at" },
  { source: "VPN", target: "L4", label: "transport mode at" },
  { source: "IPSec", target: "L3", label: "tunnel mode at" },
  { source: "NAT", target: "L3", label: "operates at" },
  { source: "VLAN", target: "L2", label: "operates at" },
  { source: "WPA2", target: "L2", label: "secures" },
  { source: "TCP", target: "UDP", label: "alternative to" },
  { source: "DNS", target: "DNSSEC", label: "secured by" },
  { source: "SCP", target: "SSH", label: "uses" },
  { source: "RAS", target: "VPN", label: "evolved into" },
  { source: "TTLS", target: "TLS", label: "extends" },
  { source: "TTLS", target: "RADIUS", label: "used with" },
  { source: "SDN", target: "VLAN", label: "manages" },
  { source: "RTOS", target: "ICS", label: "used in" },
  { source: "UPS", target: "BCP", label: "supports" },
  { source: "SOW", target: "SLA", label: "references" },
  { source: "SLA", target: "RTO", label: "defines" },
  { source: "SLA", target: "RPO", label: "defines" },
  { source: "PPTP", target: "L5", label: "operates at" },
  { source: "PPTP", target: "VPN", label: "older version of" },
  { source: "PPTP", target: "IPSec", label: "replaced by" },
  { source: "NetBIOS", target: "L5", label: "operates at" },
  { source: "NetBIOS", target: "LDAP", label: "predecessor to" },
  { source: "RPC", target: "L5", label: "operates at" },
  { source: "RPC", target: "C2", label: "abused by" },
  { source: "ESP", target: "IPSec", label: "part of" },
  { source: "ESP", target: "AH", label: "extends" },
  { source: "AH", target: "L3", label: "operates at" },
  { source: "ESP", target: "L3", label: "operates at" },
  { source: "CRS", target: "WAF", label: "loaded into" },
  { source: "CRS", target: "XSS", label: "blocks" },
  { source: "CRS", target: "SQLi", label: "blocks" },
  { source: "SWG", target: "WAF", label: "complements" },
  { source: "SWG", target: "DLP", label: "enforces" },
  { source: "SASE", target: "SD-WAN", label: "includes" },
  { source: "PaaS", target: "IaaS", label: "built on" },
  { source: "SaaS", target: "PaaS", label: "built on" },
  { source: "SASE", target: "CASB", label: "includes" },
  { source: "SASE", target: "ZTNA", label: "includes" },
  { source: "SASE", target: "FWaaS", label: "includes" },
  { source: "SASE", target: "SWG", label: "includes" },
  { source: "FWaaS", target: "NGFW", label: "cloud version of" },
  { source: "SD-WAN", target: "VPN", label: "can replace" },
  { source: "SD-WAN", target: "SDN", label: "based on" },
  { source: "HIPAA", target: "PHI", label: "protects" },
  { source: "PHI", target: "PII", label: "subset of" },
  { source: "TACACS+", target: "RADIUS", label: "alternative to" },
  { source: "KDC", target: "AS", label: "contains" },
  { source: "KDC", target: "TGS", label: "contains" },
  { source: "AS", target: "TGT", label: "issues" },
  { source: "TGS", target: "ST", label: "issues" },
  { source: "TGT", target: "TGS", label: "presented to" },
  { source: "ST", target: "IAM", label: "grants access via" },
  { source: "KDC", target: "LDAP", label: "queries" },
  { source: "KDC", target: "SSO", label: "enables" },
  { source: "TGT", target: "MFA", label: "obtained after" },
  { source: "TACACS+", target: "IAM", label: "feeds into" },
  { source: "SAE", target: "WPA2", label: "replaces PSK in" },
  { source: "SAE", target: "MFA", label: "strengthens" },
  { source: "PSU", target: "PDU", label: "feeds into" },
  { source: "PDU", target: "UPS", label: "backed by" },
  { source: "UPS", target: "BCP", label: "supports" },
  { source: "RAID1", target: "RAID0", label: "adds redundancy vs" },
  { source: "RAID5", target: "RAID0", label: "adds parity to" },
  { source: "RAID6", target: "RAID5", label: "adds 2nd parity to" },
  { source: "RAID10", target: "RAID1", label: "combines" },
  { source: "RAID10", target: "RAID0", label: "combines" },
  { source: "HOT", target: "WARM", label: "faster than" },
  { source: "WARM", target: "COLD", label: "faster than" },
  { source: "HOT", target: "RTO", label: "minimizes" },
  { source: "COLD", target: "RTO", label: "worst" },
  { source: "COOP", target: "BCP", label: "government version of" },
  { source: "API", target: "L7", label: "operates at" },
  { source: "API", target: "HTTPS", label: "communicates via" },
  { source: "API", target: "OAuth", label: "secured by" },
  { source: "API", target: "WAF", label: "protected by" },
  { source: "MTBF", target: "MTTF", label: "includes" },
  { source: "MTBF", target: "MTTR", label: "includes" },
  { source: "MTTR", target: "RTO", label: "compared to" },
  { source: "MTTF", target: "MTBF", label: "feeds into" },
  { source: "MTBF", target: "BCP", label: "informs" },
  { source: "MOU", target: "SLA", label: "precedes" },
  { source: "ARO", target: "ALE", label: "used to calculate" },
  { source: "SLE", target: "ALE", label: "used to calculate" },
  { source: "SLE", target: "ARO", label: "combined with" },
  { source: "ALE", target: "GRC", label: "informs" },
  { source: "ALE", target: "BCP", label: "justifies spend on" },
  { source: "ICMP", target: "L3", label: "operates at" },
  { source: "NAT", target: "L3", label: "operates at" },
  { source: "PAT", target: "NAT", label: "type of" },
  { source: "PAT", target: "L3", label: "operates at" },
  { source: "SED", target: "AES", label: "uses" },
  { source: "SED", target: "TPM", label: "similar to" },
  { source: "SED", target: "HSM", label: "complement to" },
  { source: "AIS", target: "IoC", label: "shares" },
  { source: "AIS", target: "SIEM", label: "feeds into" },
  { source: "AIS", target: "SOC", label: "supports" },
  { source: "STIX", target: "TAXII", label: "transported by" },
  { source: "STIX", target: "IoC", label: "describes" },
  { source: "NVD", target: "CVE", label: "enriches" },
  { source: "NVD", target: "CVSS", label: "scores with" },
  { source: "NVD", target: "NIST", label: "run by" },
  { source: "RAT", target: "C2", label: "connects to" },
  { source: "RAT", target: "IoC", label: "generates" },
  { source: "NTP", target: "L7", label: "operates at" },
  { source: "NTP", target: "Kerberos", label: "required by" },
  { source: "SNMP", target: "L7", label: "operates at" },
  { source: "NNTP", target: "L7", label: "operates at" },
  { source: "TFTP", target: "UDP", label: "uses" },
  { source: "TFTP", target: "L7", label: "operates at" },
  { source: "RDS", target: "RDP", label: "uses" },
  { source: "DSA", target: "PKI", label: "used in" },
  { source: "DSA", target: "SHA", label: "uses" },
  { source: "PFS", target: "TLS", label: "used in" },
  { source: "PFS", target: "IKE", label: "provided by" },
  { source: "RuBAC", target: "IAM", label: "part of" },
  { source: "RuBAC", target: "ABAC", label: "compared to" },
  { source: "AAA", target: "RADIUS", label: "implemented by" },
  { source: "AAA", target: "TACACS", label: "implemented by" },
  { source: "AAA", target: "IAM", label: "part of" },
  { source: "ISO", target: "GRC", label: "supports" },
  { source: "ISO", target: "NIST", label: "compared to" },
  { source: "EF", target: "SLE", label: "input to" },
  { source: "EF", target: "ALE", label: "factors into" },
  { source: "AV", target: "SLE", label: "input to" },
  { source: "EF", target: "SLE", label: "input to" },
  { source: "GLBA", target: "GRC", label: "enforced under" },
  { source: "GLBA", target: "PII", label: "protects" },
  { source: "EULA", target: "AUP", label: "compared to" },
  { source: "AUP", target: "GRC", label: "part of" },
  { source: "SDLS", target: "SDLM", label: "secures" },
  { source: "RAD", target: "SDLM", label: "type of" },
  { source: "SDLS", target: "GRC", label: "supports" },
  { source: "PLC", target: "ICS", label: "part of" },
  { source: "PLC", target: "SCADA", label: "controlled by" },
  { source: "RTU", target: "SCADA", label: "reports to" },
  { source: "RTU", target: "ICS", label: "part of" },
  { source: "RFID", target: "MFA", label: "used as factor in" },
  { source: "SIP", target: "L7", label: "operates at" },
  { source: "SIP", target: "TLS", label: "secured by" },
  { source: "OID", target: "MIB", label: "addresses in" },
  { source: "OID", target: "SNMP", label: "used by" },
  { source: "DPI", target: "NGFW", label: "used by" },
  { source: "DPI", target: "IPS", label: "enables" },
  { source: "DPI", target: "L7", label: "inspects up to" },
  { source: "ECB", target: "AES", label: "mode of" },
  { source: "CBC", target: "AES", label: "mode of" },
  { source: "CBC", target: "IV", label: "requires" },
  { source: "CFB", target: "AES", label: "mode of" },
  { source: "CFB", target: "IV", label: "requires" },
  { source: "GCM", target: "IV", label: "requires" },
  { source: "CBC", target: "ECB", label: "improves on" },
  { source: "SOAP", target: "API", label: "type of" },
  { source: "SOAP", target: "L7", label: "operates at" },
  { source: "SVC", target: "WAN", label: "used in" },
  { source: "DCS", target: "ICS", label: "type of" },
  { source: "DCS", target: "SCADA", label: "compared to" },
  { source: "MIB", target: "SNMP", label: "queried by" },
  { source: "NMS", target: "SNMP", label: "uses" },
  { source: "NMS", target: "MIB", label: "reads" },
  { source: "ACL", target: "RuBAC", label: "implements" },
  { source: "ACL", target: "IAM", label: "part of" },
  { source: "ACL", target: "NGFW", label: "used by" },
  { source: "VLAN", target: "LAN", label: "segments" },
  { source: "WLAN", target: "LAN", label: "wireless form of" },
  { source: "WAN", target: "LAN", label: "connects multiple" },
  { source: "MAN", target: "WAN", label: "smaller than" },
  { source: "MAN", target: "LAN", label: "larger than" },
  { source: "PAN", target: "LAN", label: "smaller than" },
  { source: "WLAN", target: "WPA2", label: "secured by" },
  { source: "FW", target: "ACL", label: "uses" },
  { source: "FW", target: "NGFW", label: "basic form of" },
  { source: "FW", target: "WAN", label: "protects boundary to" },
  { source: "GPG", target: "PGP", label: "open-source version of" },
  { source: "PGP", target: "PKI", label: "uses" },
  { source: "PGP", target: "AES", label: "uses" },
  { source: "GPG", target: "AES", label: "uses" },
  { source: "IKE", target: "IPSec", label: "negotiates for" },
  { source: "IKE", target: "AES", label: "uses" },
  { source: "SPD", target: "IPSec", label: "part of" },
  { source: "SPD", target: "IKE", label: "works with" },
  { source: "L2TP", target: "IPSec", label: "paired with" },
  { source: "L2TP", target: "VPN", label: "used in" },
  { source: "L2TP", target: "L2", label: "operates at" },
  { source: "SMTPS", target: "TLS", label: "uses" },
  { source: "SMTPS", target: "L7", label: "operates at" },
  { source: "SMTPS", target: "SMTP", label: "secure version of" },
  { source: "PUP", target: "CVE", label: "may generate" },
  { source: "SEH", target: "CVE", label: "exploited via" },
  { source: "UAC", target: "PAM", label: "supports" },
  { source: "UAC", target: "IAM", label: "enforces" },
  { source: "UEFI", target: "TPM", label: "works with" },
  { source: "ESG", target: "DMARC", label: "enforces" },
  { source: "ESG", target: "SPF", label: "checks" },
  { source: "ESG", target: "DKIM", label: "checks" },
  { source: "ESG", target: "DLP", label: "enforces" },
  { source: "TAXII", target: "AIS", label: "transport for" },
  { source: "CER", target: "FRR", label: "balances" },
  { source: "EER", target: "CER", label: "same as" },
  { source: "ICMP", target: "DDoS", label: "exploited in" },
  { source: "MOU", target: "BPA", label: "may lead to" },
  { source: "BPA", target: "SLA", label: "defines terms for" },
  { source: "BPA", target: "SOW", label: "references" },
  { source: "MSA", target: "SLA", label: "governs" },
  { source: "MSA", target: "SOW", label: "contains" },
  { source: "MSA", target: "BPA", label: "similar to" },
  { source: "FTP", target: "L7", label: "operates at" },
  { source: "SFTP", target: "SSH", label: "uses" },
  { source: "SFTP", target: "FTP", label: "secure replacement for" },
  { source: "FTPS", target: "TLS", label: "uses" },
  { source: "FTPS", target: "FTP", label: "secure version of" },
  { source: "SFTP", target: "FTPS", label: "alternative to" },
  { source: "BGP", target: "L3", label: "operates at" },
  { source: "BGP", target: "VLAN", label: "routes between" },
  { source: "TOCTOU", target: "CVE", label: "class of" },
  { source: "TOCTOU", target: "MITM", label: "similar timing to" },
  { source: "COOP", target: "DRP", label: "includes" },
  { source: "HOT", target: "BCP", label: "supports" },
  { source: "ASLR", target: "CVE", label: "mitigates exploits in" },
  { source: "ASLR", target: "ICS", label: "protects" },
  { source: "SCAP", target: "NIST", label: "published by" },
  { source: "SCAP", target: "GRC", label: "supports" },
  { source: "SCAP", target: "CVE", label: "references" },
  { source: "GCMP", target: "GCM", label: "based on" },
  { source: "GCMP", target: "AES", label: "uses" },
  { source: "GCMP", target: "WPA2", label: "replaces CCMP in" },
  { source: "PEM", target: "PKI", label: "format used in" },
  { source: "PEM", target: "CA", label: "issued as" },
  { source: "PEM", target: "TLS", label: "used in" },
  { source: "EAP", target: "RADIUS", label: "used with" },
  { source: "EAP", target: "TTLS", label: "variant" },
  { source: "EAP", target: "L2", label: "operates at" },
  { source: "EAP", target: "WPA2", label: "used in 802.1X" },
  { source: "DKIM", target: "DNS", label: "uses" },
  { source: "DKIM", target: "L7", label: "operates at" },
  { source: "SPF", target: "DNS", label: "stored in" },
  { source: "SPF", target: "L7", label: "operates at" },
  { source: "SPF", target: "DKIM", label: "complements" },
  { source: "DMARC", target: "SPF", label: "builds on" },
  { source: "DMARC", target: "DKIM", label: "builds on" },
  { source: "DMARC", target: "DNS", label: "stored in" },
  { source: "DMARC", target: "L7", label: "operates at" },
  { source: "DMAC", target: "L2", label: "operates at" },
  { source: "DMAC", target: "VLAN", label: "used in" },
  { source: "ABAC", target: "RBAC", label: "more flexible than" },
  { source: "ABAC", target: "IAM", label: "part of" },
  { source: "FRR", target: "MFA", label: "metric for" },
  { source: "BIA", target: "BCP", label: "foundation of" },
  { source: "BIA", target: "DRP", label: "informs" },
  { source: "BIA", target: "RPO", label: "determines" },
  { source: "BIA", target: "RTO", label: "determines" },
];

const R = 16;
const W = 1120;
const H = 640;
const PAD = 40;

const BUILD_LABELS = new Set([
  "uses",
  "relies on",
  "built on",
  "extends",
  "based on",
  "mode of",
  "includes",
  "contains",
  "part of",
  "encrypts via",
  "key exchange via",
  "secured by",
]);

function getComponents(nodeId) {
  const isComponentLink = (label) =>
    BUILD_LABELS.has(label) ||
    /\buse[sd]?\b/.test(label) || // "can use", "SSL VPN uses", "used in"
    label.includes("built on") ||
    label.includes("relies on") ||
    label.includes("works with") ||
    label.includes("loaded into") ||
    label.includes("secured by") ||
    label.includes("protects") ||
    label.includes("manages");

  return LINKS.filter(
    (l) =>
      l.source === nodeId &&
      isComponentLink(l.label) &&
      !l.label.includes("operates at") &&
      !l.label.includes("tunnel mode")
  ).map((l) => ({ id: l.target, rel: l.label }));
}

function RecipeNode({ nodeId, depth, onSelect }) {
  const [open, setOpen] = useState(depth < 1);
  const node = NODES.find((n) => n.id === nodeId);
  const comps = getComponents(nodeId);
  if (!node) return null;
  const c = CAT_COLOR[node.cat];
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 0",
          cursor: comps.length > 0 ? "pointer" : "default",
        }}
        onClick={() => comps.length > 0 && setOpen((o) => !o)}
      >
        <span style={{ fontSize: 10, color: "#ccc", width: 12, flexShrink: 0 }}>
          {comps.length > 0 ? (open ? "▾" : "▸") : "·"}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          style={{
            background: c + "18",
            color: c,
            fontSize: 11,
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: 5,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {node.id}
        </span>
        <span style={{ fontSize: 11, color: "#777", lineHeight: 1.3 }}>
          {node.full}
        </span>
      </div>
      {open && comps.length > 0 && (
        <div
          style={{
            marginLeft: 18,
            borderLeft: `2px solid ${c}22`,
            paddingLeft: 10,
          }}
        >
          {comps.map((comp, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 9,
                  color: "#ccc",
                  marginBottom: -2,
                  marginTop: 2,
                }}
              >
                ↳ {comp.rel}
              </div>
              <RecipeNode
                nodeId={comp.id}
                depth={depth + 1}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PREREQ_LABELS = new Set([
  "uses",
  "relies on",
  "built on",
  "extends",
  "based on",
  "mode of",
  "part of",
  "encrypts via",
  "key exchange via",
  "secured by",
  "foundation of",
  "includes",
  "built on",
  "based on",
  "operates at",
]);

function Learn({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) {
      setSearchRes([]);
      setShowDrop(false);
      return;
    }
    const q = val.toLowerCase();
    const res = NODES.filter(
      (n) => n.id.toLowerCase().includes(q) || n.full.toLowerCase().includes(q)
    )
      .sort((a, b) => {
        if (a.id.toLowerCase() === q) return -1;
        if (b.id.toLowerCase() === q) return 1;
        if (a.id.toLowerCase().startsWith(q)) return -1;
        if (b.id.toLowerCase().startsWith(q)) return 1;
        return 0;
      })
      .slice(0, 8);
    setSearchRes(res);
    setShowDrop(true);
  };

  // BFS backwards: find what you need to know BEFORE this node
  function getPrereqs(nodeId) {
    const visited = new Set([nodeId]);
    const levels = [];
    let frontier = [nodeId];
    for (let d = 0; d < 3 && frontier.length > 0; d++) {
      const next = [];
      frontier.forEach((id) => {
        LINKS.filter(
          (l) => l.source === id && PREREQ_LABELS.has(l.label)
        ).forEach((l) => {
          if (!visited.has(l.target)) {
            visited.add(l.target);
            next.push(l.target);
          }
        });
      });
      if (next.length) levels.push({ depth: d + 1, ids: next });
      frontier = next;
    }
    return levels.reverse(); // most foundational first
  }

  // Forward: find what this node ENABLES
  function getUnlocks(nodeId) {
    return [
      ...new Set(
        LINKS.filter(
          (l) => l.target === nodeId && PREREQ_LABELS.has(l.label)
        ).map((l) => l.source)
      ),
    ].slice(0, 8);
  }

  const prereqLevels = selected ? getPrereqs(selected.id) : [];
  const unlocks = selected ? getUnlocks(selected.id) : [];
  const allPrereqIds = prereqLevels.flatMap((l) => l.ids);

  const [analogy, setAnalogy] = useState(null);
  const [analogyLoading, setAnalogyLoading] = useState(false);
  const [contrast, setContrast] = useState(null);
  const [contrastLoading, setContrastLoading] = useState(false);
  const [mnemonic, setMnemonic] = useState(null);
  const [mnemonicLoading, setMnemonicLoading] = useState(false);

  // Study content (analogy, contrast, mnemonic) is pre-generated and shipped as
  // static JSON, so the public site needs no API key and makes no network calls.
  useEffect(() => {
    if (!selected) return;
    const entry = STUDY_CONTENT[selected.id];
    setAnalogy(entry?.analogy ?? null);
    setContrast(entry?.contrast ?? null);
    setMnemonic(entry?.mnemonic ?? null);
  }, [selected?.id]);

  const NodeCard = ({ id, highlight }) => {
    const node = NODES.find((n) => n.id === id);
    if (!node) return null;
    const c = CAT_COLOR[node.cat];
    return (
      <div
        onClick={() => {
          setSelected(node);
          setSearch(node.id);
          setShowDrop(false);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          background: highlight ? c + "22" : "#f9f9f9",
          border: `1.5px solid ${highlight ? c : "#e0e0e0"}`,
          borderRadius: 10,
          padding: "8px 12px",
          boxShadow: highlight ? `0 0 0 2px ${c}33` : "none",
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, color: c }}>
          {node.id}
        </span>
        <span style={{ fontSize: 11, color: "#666" }}>{node.full}</span>
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        padding: "16px",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => search && setShowDrop(true)}
              placeholder="Type an acronym to build your learning path..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 32px",
                fontSize: 14,
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                outline: "none",
                background: "#f9f9f9",
                boxSizing: "border-box",
                color: "#111",
              }}
            />
            {search && (
              <span
                onClick={() => {
                  setSearch("");
                  setSearchRes([]);
                  setShowDrop(false);
                  setSelected(null);
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#aaa",
                  fontSize: 16,
                }}
              >
                ×
              </span>
            )}
          </div>
        </div>
        {showDrop && searchRes.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 200,
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 10,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {searchRes.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setSelected(n);
                  setSearch(n.id);
                  setShowDrop(false);
                }}
                style={{
                  padding: "9px 14px",
                  cursor: "pointer",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  borderBottom: "1px solid #f5f5f5",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                <span
                  style={{
                    background: CAT_COLOR[n.cat] + "20",
                    color: CAT_COLOR[n.cat],
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: 5,
                  }}
                >
                  {n.id}
                </span>
                <span style={{ fontSize: 12, color: "#555" }}>{n.full}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!selected && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🗺</div>
          <div style={{ fontSize: 14 }}>
            Search for an acronym to see what you need to learn first — and what
            it unlocks
          </div>
        </div>
      )}

      {selected && (
        <div>
          {/* Prerequisites */}
          {prereqLevels.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                📚 Learn these first
              </div>
              {prereqLevels.map((level, li) => (
                <div key={li}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#ccc",
                      marginBottom: 6,
                      marginLeft: 4,
                    }}
                  >
                    {level.depth === prereqLevels.length
                      ? "Foundation"
                      : level.depth === 1
                      ? "Directly needed"
                      : "Also helpful"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    {level.ids.map((id) => (
                      <NodeCard key={id} id={id} />
                    ))}
                  </div>
                  {li < prereqLevels.length - 1 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#ddd",
                        fontSize: 18,
                        margin: "4px 0",
                      }}
                    >
                      ↓
                    </div>
                  )}
                </div>
              ))}
              <div
                style={{
                  textAlign: "center",
                  color: "#ddd",
                  fontSize: 18,
                  margin: "4px 0",
                }}
              >
                ↓
              </div>
            </div>
          )}

          {/* Selected node */}
          <div
            style={{
              background: CAT_COLOR[selected.cat] + "12",
              border: `2px solid ${CAT_COLOR[selected.cat]}`,
              borderRadius: 14,
              padding: "16px 18px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: CAT_COLOR[selected.cat],
                }}
              >
                {selected.id}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#aaa",
                  background: "#f0f0f0",
                  padding: "2px 8px",
                  borderRadius: 8,
                }}
              >
                {CAT_LABEL[selected.cat]}
              </span>
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111",
                marginBottom: 4,
              }}
            >
              {selected.full}
            </div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
              {selected.desc}
            </div>

            {/* Mnemonic */}
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${CAT_COLOR[selected.cat]}22`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#534AB7",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                🧠 Mnemonic
              </div>
              {mnemonicLoading && (
                <div
                  style={{ fontSize: 12, color: "#bbb", fontStyle: "italic" }}
                >
                  Generating mnemonic...
                </div>
              )}
              {mnemonic && !mnemonicLoading && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 6,
                    }}
                  >
                    {mnemonic.breakdown?.length > 0 ? (
                      mnemonic.breakdown.map((b, i) => (
                        <span key={i} style={{ fontSize: 13 }}>
                          <span style={{ fontWeight: 900, color: "#534AB7" }}>
                            {b.letter}
                          </span>
                          <span style={{ color: "#666" }}>
                            {b.word?.slice(1)}
                          </span>
                          {i < mnemonic.breakdown.length - 1 && (
                            <span style={{ color: "#ccc", margin: "0 2px" }}>
                              {" "}
                            </span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: 13, color: "#666" }}>
                        {mnemonic.phrase}
                      </span>
                    )}
                  </div>
                  {mnemonic.breakdown?.length > 0 && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#888",
                        fontStyle: "italic",
                      }}
                    >
                      "{mnemonic.phrase}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Analogy */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${CAT_COLOR[selected.cat]}22`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: CAT_COLOR[selected.cat],
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                💡 Analogy
              </div>
              {analogyLoading && (
                <div
                  style={{ fontSize: 12, color: "#bbb", fontStyle: "italic" }}
                >
                  Generating analogy...
                </div>
              )}
              {analogy && !analogyLoading && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#444",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  "{analogy}"
                </div>
              )}
            </div>

            {/* Contrast */}
            <div
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${CAT_COLOR[selected.cat]}22`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#E9A800",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                ⚡ Contrast
              </div>
              {contrastLoading && (
                <div
                  style={{ fontSize: 12, color: "#bbb", fontStyle: "italic" }}
                >
                  Generating contrast...
                </div>
              )}
              {contrast && !contrastLoading && (
                <div>
                  {/* Main concept pill */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        background: CAT_COLOR[selected.cat],
                        color: "#fff",
                        borderRadius: 10,
                        padding: "8px 18px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {selected.id}
                      </div>
                      <div
                        style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}
                      >
                        {contrast.headline}
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  {contrast.vs?.length > 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#ddd",
                        fontSize: 13,
                        marginBottom: 6,
                      }}
                    >
                      vs
                    </div>
                  )}
                  {/* Comparison cards */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      justifyContent: "center",
                      marginBottom: 8,
                    }}
                  >
                    {contrast.vs?.map((item, i) => {
                      const n = NODES.find((x) => x.id === item.id);
                      const c = n ? CAT_COLOR[n.cat] : "#888";
                      return (
                        <div
                          key={i}
                          onClick={() =>
                            n &&
                            (setSelected(n),
                            setSearch(n.id),
                            setShowDrop(false))
                          }
                          style={{
                            background: c + "12",
                            border: `1.5px solid ${c}44`,
                            borderRadius: 8,
                            padding: "6px 12px",
                            textAlign: "center",
                            cursor: n ? "pointer" : "default",
                            minWidth: 80,
                          }}
                        >
                          <div
                            style={{ fontSize: 12, fontWeight: 800, color: c }}
                          >
                            {item.id}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "#888",
                              marginTop: 2,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.note}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Key difference */}
                  {contrast.edge && (
                    <div
                      style={{
                        background: "#FFFBEC",
                        borderLeft: "3px solid #E9A800",
                        borderRadius: "0 6px 6px 0",
                        padding: "6px 10px",
                        fontSize: 11,
                        color: "#666",
                        lineHeight: 1.5,
                      }}
                    >
                      ⚡ {contrast.edge}
                    </div>
                  )}
                </div>
              )}
            </div>

            {allPrereqIds.length === 0 && (
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>
                ✦ No prerequisites — good starting point!
              </div>
            )}
          </div>

          {/* Breakdown tree */}
          {getComponents(selected.id).length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                🔧 Breakdown
              </div>
              {/* Formula line */}
              <div
                style={{
                  fontSize: 14,
                  marginBottom: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    color: CAT_COLOR[selected.cat],
                    fontSize: 16,
                  }}
                >
                  {selected.id}
                </span>
                <span style={{ color: "#ccc", margin: "0 2px" }}>=</span>
                {getComponents(selected.id).map((comp, i) => {
                  const cn = NODES.find((n) => n.id === comp.id);
                  return (
                    <span
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {i > 0 && <span style={{ color: "#ccc" }}>+</span>}
                      <span
                        onClick={() => {
                          setSelected(cn);
                          setSearch(cn?.id || "");
                          setShowDrop(false);
                        }}
                        style={{
                          fontWeight: 700,
                          color: CAT_COLOR[cn?.cat] || "#555",
                          background: (CAT_COLOR[cn?.cat] || "#555") + "15",
                          padding: "1px 7px",
                          borderRadius: 5,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {comp.id}
                      </span>
                    </span>
                  );
                })}
              </div>
              {/* Interactive tree */}
              <div
                style={{
                  background: "#f9f9f9",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <RecipeNode
                  nodeId={selected.id}
                  depth={0}
                  onSelect={(node) => {
                    setSelected(node);
                    setSearch(node.id);
                    setShowDrop(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Unlocks */}
          {unlocks.length > 0 && (
            <div>
              <div
                style={{
                  textAlign: "center",
                  color: "#ddd",
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                ↓
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                🚀 This knowledge unlocks
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {unlocks.map((id) => (
                  <NodeCard key={id} id={id} />
                ))}
              </div>
            </div>
          )}

          {unlocks.length === 0 && allPrereqIds.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#bbb",
                fontSize: 12,
                marginTop: 8,
              }}
            >
              This is a standalone concept — search another acronym to explore
              its path.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Quiz({ onBack }) {
  const TOTAL = 20;
  const TIMER = 25;
  const ALL_CATS = Object.keys(CAT_COLOR);

  const [started, setStarted] = useState(false);
  const [selCats, setSelCats] = useState(new Set(ALL_CATS));
  const [riskMode, setRiskMode] = useState(false);

  const toggleCat = (cat) =>
    setSelCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else next.add(cat);
      return next;
    });

  const availableNodes = NODES.filter((n) => selCats.has(n.cat));
  const canStart = availableNodes.length >= 4;

  // ── Risk math question generator ──────────────────────
  function genRiskQuestion() {
    const assets = [
      { name: "a database server", av: 50000 },
      { name: "a company laptop", av: 1500 },
      { name: "the e-commerce website", av: 200000 },
      { name: "a file server", av: 80000 },
      { name: "customer PII records", av: 120000 },
      { name: "a point-of-sale system", av: 25000 },
      { name: "an email server", av: 40000 },
    ];
    const a = assets[Math.floor(Math.random() * assets.length)];
    const efPct = [10, 20, 25, 30, 40, 50, 75][Math.floor(Math.random() * 7)];
    const ef = efPct / 100;
    const aro = [0.1, 0.25, 0.5, 1, 2, 3, 5][Math.floor(Math.random() * 7)];
    const sle = a.av * ef;
    const ale = sle * aro;

    const fmt = (n) =>
      "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
    const variants = [
      // Solve for SLE
      () => {
        const correct = fmt(sle);
        const wrongs = [
          fmt(a.av * ef * 2),
          fmt(a.av * (ef / 2)),
          fmt(a.av - sle),
        ].filter((w) => w !== correct);
        return {
          type: "RISK",
          prompt: `${
            a.name[0].toUpperCase() + a.name.slice(1)
          } is valued at ${fmt(
            a.av
          )}. A single incident is estimated to destroy ${efPct}% of its value. What is the SLE?`,
          subtitle: "SLE = AV × EF",
          options: [correct, ...wrongs.slice(0, 3)].sort(
            () => Math.random() - 0.5
          ),
          correct,
          cat: "policy",
          hint: `SLE = AV × EF = ${fmt(a.av)} × ${ef} = ${fmt(sle)}`,
        };
      },
      // Solve for ALE
      () => {
        const correct = fmt(ale);
        const wrongs = [fmt(sle), fmt(ale * 2), fmt(a.av * aro)].filter(
          (w) => w !== correct
        );
        return {
          type: "RISK",
          prompt: `The SLE for ${a.name} is ${fmt(
            sle
          )}, and the threat is expected to occur ${aro} time(s) per year. What is the ALE?`,
          subtitle: "ALE = SLE × ARO",
          options: [correct, ...wrongs.slice(0, 3)].sort(
            () => Math.random() - 0.5
          ),
          correct,
          cat: "policy",
          hint: `ALE = SLE × ARO = ${fmt(sle)} × ${aro} = ${fmt(ale)}`,
        };
      },
      // Full chain to ALE
      () => {
        const correct = fmt(ale);
        const wrongs = [
          fmt(sle),
          fmt(a.av * ef * (aro + 1)),
          fmt(a.av * aro),
        ].filter((w) => w !== correct);
        return {
          type: "RISK",
          prompt: `${a.name[0].toUpperCase() + a.name.slice(1)} (value ${fmt(
            a.av
          )}) loses ${efPct}% per incident, occurring ${aro}×/year. What is the ALE?`,
          subtitle: "ALE = (AV × EF) × ARO",
          options: [correct, ...wrongs.slice(0, 3)].sort(
            () => Math.random() - 0.5
          ),
          correct,
          cat: "policy",
          hint: `SLE = ${fmt(a.av)} × ${ef} = ${fmt(sle)}; ALE = ${fmt(
            sle
          )} × ${aro} = ${fmt(ale)}`,
        };
      },
      // Solve for EF
      () => {
        const correct = efPct + "%";
        const wrongs = [
          efPct * 2 + "%",
          Math.round(efPct / 2) + "%",
          100 - efPct + "%",
        ].filter((w) => w !== correct);
        return {
          type: "RISK",
          prompt: `${a.name[0].toUpperCase() + a.name.slice(1)} is worth ${fmt(
            a.av
          )}. A single incident causes ${fmt(
            sle
          )} in loss. What is the Exposure Factor (EF)?`,
          subtitle: "EF = SLE ÷ AV",
          options: [correct, ...wrongs.slice(0, 3)].sort(
            () => Math.random() - 0.5
          ),
          correct,
          cat: "policy",
          hint: `EF = SLE ÷ AV = ${fmt(sle)} ÷ ${fmt(
            a.av
          )} = ${ef} = ${efPct}%`,
        };
      },
    ];
    return variants[Math.floor(Math.random() * variants.length)]();
  }

  const generate = useCallback(() => {
    function maskAcro(id) {
      const letters = id.replace(/[^a-zA-Z]/g, "");
      if (letters.length <= 2) return id; // too short to mask meaningfully
      // Mask ~60% of letters, always keep first letter visible, randomize which are hidden
      const chars = id.split("");
      const letterIdxs = chars
        .map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1))
        .filter((i) => i !== -1);
      const toHide = Math.max(1, Math.ceil(letterIdxs.length * 0.6));
      const hideable = letterIdxs.slice(1); // never hide first letter
      const shuffled = [...hideable]
        .sort(() => Math.random() - 0.5)
        .slice(0, toHide);
      shuffled.forEach((i) => (chars[i] = "_"));
      return chars.join("");
    }

    function getDistractors(node, count) {
      const stop = new Set([
        "the",
        "and",
        "for",
        "with",
        "from",
        "a",
        "an",
        "of",
        "to",
        "in",
        "is",
        "as",
        "at",
        "by",
        "on",
        "or",
      ]);
      const nw = new Set(
        node.full
          .toLowerCase()
          .split(/[\s\-\/&,()]+/)
          .filter((w) => w.length > 2 && !stop.has(w))
      );
      const nc = new Set(
        node.id
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .split("")
      );
      return NODES.filter((n) => n.id !== node.id)
        .map((n) => {
          let s = 0;
          if (n.cat === node.cat) s += 10;
          n.full
            .toLowerCase()
            .split(/[\s\-\/&,()]+/)
            .filter((w) => w.length > 2 && !stop.has(w))
            .forEach((w) => {
              if (nw.has(w)) s += 5;
            });
          if (n.id[0] === node.id[0]) s += 2;
          new Set(
            n.id
              .toLowerCase()
              .replace(/[^a-z]/g, "")
              .split("")
          ).forEach((c) => {
            if (nc.has(c)) s += 0.5;
          });
          if (Math.abs(n.id.length - node.id.length) <= 1) s += 1;
          return { n, s };
        })
        .sort((a, b) => b.s - a.s + (Math.random() - 0.5) * 2)
        .slice(0, count)
        .map((x) => x.n);
    }

    const relLabels = new Set([
      "uses",
      "relies on",
      "built on",
      "extends",
      "based on",
      "mode of",
      "encrypts via",
      "key exchange via",
      "secured by",
      "includes",
      "part of",
    ]);

    const pool = NODES.filter((n) => selCats.has(n.cat));

    // Risk Math mode: all questions are calculations
    if (riskMode) {
      return Array.from({ length: TOTAL }, () => genRiskQuestion());
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, TOTAL);
    return shuffled.map((node, idx) => {
      // Sprinkle ~15% risk questions into the normal quiz (when policy is selected)
      if (selCats.has("policy") && Math.random() < 0.15) {
        return genRiskQuestion();
      }
      const others = getDistractors(node, 3);
      const roll = Math.random();
      // A=desc→acro, B=masked→full, C=odd one out, D=relationship, E=category
      const type =
        roll < 0.22
          ? "A"
          : roll < 0.44
          ? "B"
          : roll < 0.6
          ? "C"
          : roll < 0.78
          ? "D"
          : "E";

      if (type === "A") {
        const correct = node.id;
        const options = [correct, ...others.map((n) => n.id)].sort(
          () => Math.random() - 0.5
        );
        return {
          type: "A",
          prompt: node.desc,
          subtitle: `Category hint: ${CAT_LABEL[node.cat]}`,
          options,
          correct,
          cat: node.cat,
          hint: `${node.id} = ${node.full}`,
        };
      } else if (type === "B") {
        const correct = node.full;
        const options = [correct, ...others.map((n) => n.full)].sort(
          () => Math.random() - 0.5
        );
        return {
          type: "B",
          prompt: maskAcro(node.id),
          subtitle: node.desc,
          options,
          correct,
          cat: node.cat,
          hint: node.desc,
        };
      } else if (type === "C") {
        const otherCats = Object.keys(CAT_COLOR).filter((k) => k !== node.cat);
        const groupCat =
          otherCats[Math.floor(Math.random() * otherCats.length)];
        const groupNodes = NODES.filter((n) => n.cat === groupCat)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        if (groupNodes.length < 3) {
          const correct = node.id;
          const opts = [correct, ...others.map((n) => n.id)].sort(
            () => Math.random() - 0.5
          );
          return {
            type: "A",
            prompt: node.desc,
            subtitle: `Category hint: ${CAT_LABEL[node.cat]}`,
            options: opts,
            correct,
            cat: node.cat,
            hint: `${node.id} = ${node.full}`,
          };
        }
        const correct = node.id;
        const options = [correct, ...groupNodes.map((n) => n.id)].sort(
          () => Math.random() - 0.5
        );
        return {
          type: "C",
          prompt: `Which does NOT belong to ${CAT_LABEL[groupCat]}?`,
          subtitle: null,
          options,
          correct,
          cat: node.cat,
          hint: `${node.id} (${node.full}) belongs to ${CAT_LABEL[node.cat]}`,
        };
      } else if (type === "D") {
        const out = LINKS.filter(
          (l) => l.source === node.id && relLabels.has(l.label)
        );
        const inn = LINKS.filter(
          (l) => l.target === node.id && relLabels.has(l.label)
        );
        if (out.length > 0) {
          const link = out[Math.floor(Math.random() * out.length)];
          const correct = link.target;
          const wrong = NODES.filter(
            (n) =>
              n.id !== correct &&
              n.id !== node.id &&
              !out.some((l) => l.target === n.id)
          )
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((n) => n.id);
          const options = [correct, ...wrong].sort(() => Math.random() - 0.5);
          return {
            type: "D",
            prompt: `${node.id} "${link.label}" →`,
            subtitle: node.full,
            options,
            correct,
            cat: node.cat,
            hint: node.desc,
          };
        } else if (inn.length > 0) {
          const link = inn[Math.floor(Math.random() * inn.length)];
          const correct = link.source;
          const wrong = NODES.filter(
            (n) =>
              n.id !== correct &&
              n.id !== node.id &&
              !inn.some((l) => l.source === n.id)
          )
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((n) => n.id);
          const options = [correct, ...wrong].sort(() => Math.random() - 0.5);
          return {
            type: "D",
            prompt: `Which "${link.label}" ${node.id}?`,
            subtitle: node.full,
            options,
            correct,
            cat: node.cat,
            hint: node.desc,
          };
        } else {
          const correct = node.id;
          const opts = [correct, ...others.map((n) => n.id)].sort(
            () => Math.random() - 0.5
          );
          return {
            type: "A",
            prompt: node.desc,
            subtitle: `Category hint: ${CAT_LABEL[node.cat]}`,
            options: opts,
            correct,
            cat: node.cat,
            hint: `${node.id} = ${node.full}`,
          };
        }
      } else {
        const correctCat = CAT_LABEL[node.cat];
        const wrongCats = Object.entries(CAT_LABEL)
          .filter(([k]) => k !== node.cat)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(([, v]) => v);
        const options = [correctCat, ...wrongCats].sort(
          () => Math.random() - 0.5
        );
        return {
          type: "E",
          prompt: node.id,
          subtitle: node.full,
          options,
          correct: correctCat,
          cat: node.cat,
          hint: node.desc,
        };
      }
    });
  }, [selCats, riskMode]);

  const [qs, setQs] = useState([]);
  const skipAutoGenRef = useRef(false);

  useEffect(() => {
    if (skipAutoGenRef.current) {
      skipAutoGenRef.current = false;
      return;
    }
    if (started) setQs(generate());
  }, [started, selCats, riskMode]);

  const [cur, setCur] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER);
  const [wrongIds, setWrongIds] = useState([]);
  const timerRef = useRef(null);

  const q = qs[cur];

  useEffect(() => {
    if (done || picked) return;
    const qTime = q?.type === "RISK" ? 45 : TIMER;
    setTimeLeft(qTime);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPicked("__timeout__");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cur, done]);

  useEffect(() => {
    if (picked) clearInterval(timerRef.current);
  }, [picked]);

  const color = CAT_COLOR[q?.cat] || "#555";
  const maxTime = q?.type === "RISK" ? 45 : TIMER;
  const timerPct = (timeLeft / maxTime) * 100;
  const timerColor =
    timeLeft > 10 ? "#1D9E75" : timeLeft > 5 ? "#E9A800" : "#E24B4A";

  const pick = (opt) => {
    if (picked) return;
    clearInterval(timerRef.current);
    setPicked(opt);
    if (opt === q.correct) {
      setScore((s) => s + 1);
    } else {
      const wrongNode =
        NODES.find((n) => n.id === q.correct) ||
        NODES.find((n) => n.full === q.correct);
      if (wrongNode)
        setWrongIds((prev) => [...new Set([...prev, wrongNode.id])]);
    }
  };

  const next = () => {
    if (cur + 1 >= TOTAL) {
      setDone(true);
      return;
    }
    setCur((c) => c + 1);
    setPicked(null);
  };

  const restart = () => {
    setStarted(false);
    setCur(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setTimeLeft(TIMER);
    setWrongIds([]);
  };

  const maskAcroShared = (id) => {
    const letters = id.replace(/[^a-zA-Z]/g, "");
    if (letters.length <= 2) return id;
    const chars = id.split("");
    const letterIdxs = chars
      .map((c, i) => (/[a-zA-Z]/.test(c) ? i : -1))
      .filter((i) => i !== -1);
    const toHide = Math.max(1, Math.ceil(letterIdxs.length * 0.6));
    const hideable = letterIdxs.slice(1);
    const shuffled = [...hideable]
      .sort(() => Math.random() - 0.5)
      .slice(0, toHide);
    shuffled.forEach((i) => (chars[i] = "_"));
    return chars.join("");
  };

  const retryWrong = () => {
    skipAutoGenRef.current = true;
    const pool = NODES.filter((n) => wrongIds.includes(n.id));
    const newQs = pool
      .map((node) => {
        const sameCat = NODES.filter(
          (n) => n.id !== node.id && n.cat === node.cat
        ).sort(() => Math.random() - 0.5);
        const diffCat = NODES.filter(
          (n) => n.id !== node.id && n.cat !== node.cat
        ).sort(() => Math.random() - 0.5);
        const others = [...sameCat, ...diffCat].slice(0, 3);
        const correct = node.full;
        const options = [correct, ...others.map((n) => n.full)].sort(
          () => Math.random() - 0.5
        );
        return {
          type: "B",
          prompt: maskAcroShared(node.id),
          subtitle: node.desc,
          options,
          correct,
          cat: node.cat,
          hint: node.desc,
        };
      })
      .sort(() => Math.random() - 0.5);
    setQs(newQs);
    setCur(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setTimeLeft(TIMER);
    setWrongIds([]);
  };

  const TYPE_LABEL = {
    A: "Which acronym matches this description?",
    B: "What does this masked acronym stand for?",
    C: "Odd one out:",
    D: "Relationship question:",
    E: "Which category does this belong to?",
    RISK: "🧮 Risk calculation:",
  };

  if (!started)
    return (
      <div
        style={{
          fontFamily: "system-ui,sans-serif",
          padding: "20px 16px",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#111",
            marginBottom: 4,
          }}
        >
          Choose categories
        </div>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>
          Select which domains to practice
        </div>

        {/* Risk Math toggle */}
        <button
          onClick={() => setRiskMode((r) => !r)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            marginBottom: 16,
            borderRadius: 12,
            cursor: "pointer",
            textAlign: "left",
            border: riskMode ? "2px solid #534AB7" : "1.5px solid #e0e0e0",
            background: riskMode ? "#534AB712" : "#fff",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 22 }}>🧮</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: riskMode ? "#534AB7" : "#333",
              }}
            >
              Risk Math mode
            </div>
            <div style={{ fontSize: 11, color: "#999" }}>
              SLE / ALE / ARO / EF calculations only
            </div>
          </div>
          <div
            style={{
              width: 38,
              height: 22,
              borderRadius: 11,
              background: riskMode ? "#534AB7" : "#ddd",
              position: "relative",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 2,
                left: riskMode ? 18 : 2,
                transition: "all 0.15s",
              }}
            />
          </div>
        </button>

        {/* Category grid (dimmed in risk mode) */}
        <div
          style={{
            opacity: riskMode ? 0.4 : 1,
            pointerEvents: riskMode ? "none" : "auto",
            transition: "opacity 0.15s",
          }}
        >
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 8 }}>
            {riskMode
              ? "Categories disabled in Risk Math mode"
              : "Or pick acronym domains:"}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {ALL_CATS.map((cat) => {
              const active = selCats.has(cat);
              const count = NODES.filter((n) => n.cat === cat).length;
              const c = CAT_COLOR[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCat(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 10,
                    border: active ? `2px solid ${c}` : "1.5px solid #e0e0e0",
                    background: active ? c + "15" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: active ? c : "#ddd",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: active ? c : "#aaa",
                    }}
                  >
                    {CAT_LABEL[cat]}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: active ? c + "aa" : "#ccc",
                      background: active ? c + "18" : "#f5f5f5",
                      padding: "1px 6px",
                      borderRadius: 8,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Select all / clear */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => setSelCats(new Set(ALL_CATS))}
              style={{
                fontSize: 11,
                color: "#888",
                background: "none",
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Select all
            </button>
            <button
              onClick={() => setSelCats(new Set([ALL_CATS[0]]))}
              style={{
                fontSize: 11,
                color: "#888",
                background: "none",
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={() => {
            if (canStart || riskMode) setStarted(true);
          }}
          disabled={!canStart && !riskMode}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            fontSize: 15,
            fontWeight: 700,
            cursor: canStart || riskMode ? "pointer" : "not-allowed",
            background: riskMode ? "#534AB7" : canStart ? "#1D9E75" : "#e0e0e0",
            color: canStart || riskMode ? "#fff" : "#aaa",
            transition: "all 0.15s",
          }}
        >
          {riskMode
            ? `Start Risk Math — ${TOTAL} problems`
            : canStart
            ? `Start Quiz — ${Math.min(availableNodes.length, TOTAL)} questions`
            : "Select at least 4 acronyms"}
        </button>
        <button
          onClick={onBack}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "10px",
            borderRadius: 10,
            border: "none",
            background: "none",
            color: "#bbb",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Back to Graph
        </button>
      </div>
    );

  if (done)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          padding: 32,
          fontFamily: "system-ui,sans-serif",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 12 }}>
          {score >= 16 ? "🏆" : score >= 10 ? "💪" : "📚"}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#111",
            marginBottom: 8,
          }}
        >
          {score} / {TOTAL}
        </div>
        <div style={{ fontSize: 15, color: "#666", marginBottom: 32 }}>
          {score >= 16
            ? "Excellent! Ready for the exam."
            : score >= 10
            ? "Good progress — keep studying!"
            : "Keep practicing, you've got this!"}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={restart}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "#1D9E75",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          {wrongIds.length > 0 && (
            <button
              onClick={retryWrong}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: "#E24B4A",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔁 Retry Weak Spots ({wrongIds.length})
            </button>
          )}
          <button
            onClick={onBack}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              color: "#555",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Back to Graph
          </button>
        </div>
      </div>
    );

  if (!q)
    return (
      <div
        style={{
          padding: 48,
          textAlign: "center",
          color: "#aaa",
          fontFamily: "system-ui,sans-serif",
        }}
      >
        Loading questions...
      </div>
    );

  const timedOut = picked === "__timeout__";

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        padding: "16px 16px 24px",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      {/* Progress + score */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "#aaa" }}>
          Question {cur + 1} of {TOTAL}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1D9E75" }}>
          Score: {score}
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "#f0f0f0",
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            height: 4,
            borderRadius: 4,
            background: "#1D9E75",
            width: `${((cur + 1) / TOTAL) * 100}%`,
            transition: "width 0.3s",
          }}
        />
      </div>

      {/* Timer bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 5,
            background: "#f0f0f0",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 5,
              borderRadius: 4,
              background: timerColor,
              width: `${timerPct}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: timerColor,
            minWidth: 24,
            textAlign: "right",
          }}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Question card */}
      <div
        style={{
          background: "#fff",
          border: "1.5px solid " + color + "40",
          borderRadius: 16,
          padding: "20px 20px 16px",
          marginBottom: 16,
          borderLeft: "4px solid " + color,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: color,
            letterSpacing: "0.07em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {TYPE_LABEL[q.type]}
        </div>
        <div
          style={{
            fontSize: q.type === "B" ? 36 : q.type === "E" ? 28 : 16,
            fontWeight: q.type === "B" || q.type === "E" ? 800 : 500,
            color: "#111",
            lineHeight: 1.4,
            marginBottom: q.subtitle ? 6 : 0,
            letterSpacing: q.type === "B" ? "0.05em" : 0,
            fontFamily: q.type === "B" ? "monospace" : "inherit",
          }}
        >
          {q.prompt}
        </div>
        {q.subtitle && (
          <div
            style={{
              fontSize: q.type === "RISK" ? 13 : 12,
              color: q.type === "RISK" ? "#534AB7" : "#888",
              lineHeight: 1.5,
              fontWeight: q.type === "RISK" ? 700 : 400,
              fontFamily: q.type === "RISK" ? "monospace" : "inherit",
              marginTop: q.type === "RISK" ? 6 : 0,
            }}
          >
            {q.subtitle}
          </div>
        )}
      </div>

      {/* Options */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.correct;
          const isPicked = opt === picked;
          let bg = "#fff",
            border = "1px solid #e0e0e0",
            textColor = "#222";
          if (picked) {
            if (isCorrect) {
              bg = "#E8F8F0";
              border = "1.5px solid #1D9E75";
              textColor = "#085041";
            } else if (isPicked && !timedOut) {
              bg = "#FEECEC";
              border = "1.5px solid #E24B4A";
              textColor = "#791F1F";
            } else {
              textColor = "#aaa";
            }
          }
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border,
                background: bg,
                color: textColor,
                fontSize: q.type === "RISK" ? 16 : 13,
                textAlign: "left",
                cursor: picked ? "default" : "pointer",
                fontWeight:
                  q.type === "RISK" ? 700 : picked && isCorrect ? 600 : 400,
                transition: "all 0.15s",
                lineHeight: 1.4,
                fontFamily: q.type === "RISK" ? "monospace" : "inherit",
              }}
            >
              {picked && isCorrect && "✓ "}
              {picked && isPicked && !isCorrect && !timedOut && "✗ "}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {picked && (
        <div
          style={{
            background: timedOut
              ? "#FFF8E8"
              : picked === q.correct
              ? "#E8F8F0"
              : "#FEF0F0",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: 12,
            color: "#555",
            lineHeight: 1.5,
          }}
        >
          {timedOut
            ? "⏱ Time's up! "
            : picked === q.correct
            ? "✓ Correct! "
            : "✗ Wrong. "}
          💡{" "}
          {q.hint ||
            NODES.find((n) => n.id === q.correct || n.full === q.correct)?.desc}
        </div>
      )}
      {picked && (
        <button
          onClick={next}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "#1D9E75",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {cur + 1 >= TOTAL ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

function Ports({ onBack }) {
  const [tab, setTab] = useState("table");
  const [search, setSearch] = useState("");
  const ALL_PCATS = Object.keys(PORT_CAT_COLOR);
  const [filterCat, setFilterCat] = useState("all");

  // Quiz state
  const TOTAL = Math.min(15, PORTS.length);
  const genQuiz = () => {
    const shuffled = [...PORTS].sort(() => Math.random() - 0.5).slice(0, TOTAL);
    return shuffled.map((p) => {
      const askPort = Math.random() > 0.5;
      const others = PORTS.filter((x) => x.port !== p.port)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      if (askPort) {
        // Given protocol → guess port
        const correct = String(p.port);
        const options = [correct, ...others.map((x) => String(x.port))]
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5);
        return {
          prompt: p.name,
          sub: p.proto,
          q: "Which port?",
          options,
          correct,
          p,
        };
      } else {
        // Given port → guess protocol
        const correct = p.name;
        const options = [correct, ...others.map((x) => x.name)]
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort(() => Math.random() - 0.5);
        return {
          prompt: `Port ${p.port}`,
          sub: p.proto,
          q: "Which protocol?",
          options,
          correct,
          p,
        };
      }
    });
  };
  const [qs, setQs] = useState([]);
  const [cur, setCur] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (tab === "quiz" && qs.length === 0) setQs(genQuiz());
  }, [tab]);

  const startQuiz = () => {
    setQs(genQuiz());
    setCur(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setTab("quiz");
  };
  const q = qs[cur];

  const pickAns = (opt) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correct) setScore((s) => s + 1);
  };
  const nextQ = () => {
    if (cur + 1 >= qs.length) {
      setDone(true);
      return;
    }
    setCur((c) => c + 1);
    setPicked(null);
  };

  // Filtered + searched table
  const filtered = PORTS.filter((p) => {
    if (filterCat !== "all" && p.cat !== filterCat) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        String(p.port).includes(s) ||
        p.name.toLowerCase().includes(s) ||
        p.desc.toLowerCase().includes(s) ||
        p.proto.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div
      style={{
        fontFamily: "system-ui,sans-serif",
        padding: "16px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Tab switch */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          background: "#f4f4f5",
          borderRadius: 10,
          padding: 4,
          width: "fit-content",
        }}
      >
        {["table", "quiz"].map((t) => (
          <button
            key={t}
            onClick={() => (t === "quiz" ? startQuiz() : setTab("table"))}
            style={{
              padding: "6px 18px",
              borderRadius: 7,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#111" : "#999",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {t === "table" ? "📋 Reference" : "⚡ Quick Quiz"}
          </button>
        ))}
      </div>

      {tab === "table" && (
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
            >
              🔍
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search port, protocol, or keyword..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 32px",
                fontSize: 14,
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                outline: "none",
                background: "#f9f9f9",
                boxSizing: "border-box",
                color: "#111",
              }}
            />
          </div>
          {/* Category filter pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 14,
            }}
          >
            <button
              onClick={() => setFilterCat("all")}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 11px",
                borderRadius: 8,
                cursor: "pointer",
                border:
                  filterCat === "all"
                    ? "1.5px solid #333"
                    : "1px solid #e0e0e0",
                background: filterCat === "all" ? "#333" : "#fff",
                color: filterCat === "all" ? "#fff" : "#888",
              }}
            >
              All
            </button>
            {ALL_PCATS.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "4px 11px",
                  borderRadius: 8,
                  cursor: "pointer",
                  border:
                    filterCat === c
                      ? `1.5px solid ${PORT_CAT_COLOR[c]}`
                      : "1px solid #e0e0e0",
                  background:
                    filterCat === c ? PORT_CAT_COLOR[c] + "15" : "#fff",
                  color: filterCat === c ? PORT_CAT_COLOR[c] : "#888",
                }}
              >
                {PORT_CAT_LABEL[c]}
              </button>
            ))}
          </div>
          {/* Table */}
          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {filtered.map((p, i) => (
              <div
                key={p.port + "-" + p.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #f5f5f5" : "none",
                  background: i % 2 ? "#fafafa" : "#fff",
                }}
              >
                <div
                  style={{
                    minWidth: 54,
                    fontSize: 15,
                    fontWeight: 800,
                    color: PORT_CAT_COLOR[p.cat],
                    fontFamily: "monospace",
                  }}
                >
                  {p.port}
                </div>
                <div
                  style={{
                    minWidth: 62,
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#999",
                    textAlign: "center",
                    background: "#f0f0f0",
                    borderRadius: 5,
                    padding: "2px 4px",
                  }}
                >
                  {p.proto}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "#bbb",
                  fontSize: 13,
                }}
              >
                No ports match.
              </div>
            )}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 14,
              fontSize: 11,
              color: "#bbb",
            }}
          >
            {filtered.length} ports · 🔒 encrypted variants noted in description
          </div>
        </div>
      )}

      {tab === "quiz" && done && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>
            {score >= qs.length * 0.8
              ? "🏆"
              : score >= qs.length * 0.5
              ? "💪"
              : "📚"}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#111",
              marginBottom: 24,
            }}
          >
            {score} / {qs.length}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={startQuiz}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                border: "none",
                background: "#1D9E75",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => setTab("table")}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#555",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Reference
            </button>
          </div>
        </div>
      )}

      {tab === "quiz" && !done && q && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: "#aaa" }}>
              Question {cur + 1} of {qs.length}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1D9E75" }}>
              Score: {score}
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "#f0f0f0",
              borderRadius: 4,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                height: 4,
                borderRadius: 4,
                background: "#1D9E75",
                width: `${((cur + 1) / qs.length) * 100}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
          <div
            style={{
              background: "#fff",
              border: `1.5px solid ${PORT_CAT_COLOR[q.p.cat]}40`,
              borderLeft: `4px solid ${PORT_CAT_COLOR[q.p.cat]}`,
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: PORT_CAT_COLOR[q.p.cat],
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {q.q}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#111" }}>
              {q.prompt}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              {q.sub}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {q.options.map((opt, i) => {
              const isCorrect = opt === q.correct,
                isPicked = opt === picked;
              let bg = "#fff",
                border = "1px solid #e0e0e0",
                col = "#222";
              if (picked) {
                if (isCorrect) {
                  bg = "#E8F8F0";
                  border = "1.5px solid #1D9E75";
                  col = "#085041";
                } else if (isPicked) {
                  bg = "#FEECEC";
                  border = "1.5px solid #E24B4A";
                  col = "#791F1F";
                } else col = "#aaa";
              }
              return (
                <button
                  key={i}
                  onClick={() => pickAns(opt)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border,
                    background: bg,
                    color: col,
                    fontSize: 15,
                    fontWeight: picked && isCorrect ? 700 : 500,
                    textAlign: "left",
                    cursor: picked ? "default" : "pointer",
                    fontFamily: q.q === "Which port?" ? "monospace" : "inherit",
                  }}
                >
                  {picked && isCorrect && "✓ "}
                  {picked && isPicked && !isCorrect && "✗ "}
                  {opt}
                </button>
              );
            })}
          </div>
          {picked && (
            <div
              style={{
                background: "#f9f9f9",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 12,
                fontSize: 12,
                color: "#666",
                lineHeight: 1.5,
              }}
            >
              💡 Port {q.p.port} ({q.p.proto}) — {q.p.name}: {q.p.desc}
            </div>
          )}
          {picked && (
            <button
              onClick={nextQ}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: "#1D9E75",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {cur + 1 >= qs.length ? "See Results →" : "Next →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("graph");
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const selectedRef = useRef(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const highlightFnRef = useRef(null);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const q = val.toLowerCase();
    const results = NODES.filter(
      (n) =>
        n.id.toLowerCase().includes(q) ||
        n.full.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q)
    )
      .sort((a, b) => {
        const aId = a.id.toLowerCase(),
          bId = b.id.toLowerCase();
        // Exact ID match first
        if (aId === q && bId !== q) return -1;
        if (bId === q && aId !== q) return 1;
        // ID starts with query next
        if (aId.startsWith(q) && !bId.startsWith(q)) return -1;
        if (bId.startsWith(q) && !aId.startsWith(q)) return 1;
        // ID contains query
        if (aId.includes(q) && !bId.includes(q)) return -1;
        if (bId.includes(q) && !aId.includes(q)) return 1;
        // Full name match
        const aFull = a.full.toLowerCase(),
          bFull = b.full.toLowerCase();
        if (aFull.includes(q) && !bFull.includes(q)) return -1;
        if (bFull.includes(q) && !aFull.includes(q)) return 1;
        return 0;
      })
      .slice(0, 8);
    setSearchResults(results);
    setShowResults(true);
  };

  const focusNode = (node) => {
    setSearch(node.id);
    setShowResults(false);
    setSelected({ ...node });
    selectedRef.current = node;
    // trigger highlight via ref callback stored during d3 setup
    if (highlightRef.current) highlightRef.current(node);
  };

  const highlightRef = useRef(null);

  useEffect(() => {
    if (mode !== "graph") return;
    const svg = d3.select(svgRef.current);
    if (!svgRef.current) return;
    svg.selectAll("*").remove();

    // Arrow markers
    const defs = svg.append("defs");
    Object.entries(CAT_COLOR).forEach(([cat, color]) => {
      defs
        .append("marker")
        .attr("id", `arr-${cat}`)
        .attr("viewBox", "0 -4 8 8")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L8,0L0,4")
        .attr("fill", color);
    });
    defs
      .append("marker")
      .attr("id", "arr-dim")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", "#ccc");

    // Node positions — start near cluster centers
    const OSI_Y = {
      L7: 55,
      L6: 135,
      L5: 215,
      L4: 295,
      L3: 375,
      L2: 455,
      L1: 535,
    };

    const nodeData = NODES.map((n) => ({
      ...n,
      x:
        OSI_Y[n.id] !== undefined
          ? 55
          : CLUSTER[n.cat].x + (Math.random() - 0.5) * 50,
      y:
        OSI_Y[n.id] !== undefined
          ? OSI_Y[n.id]
          : CLUSTER[n.cat].y + (Math.random() - 0.5) * 50,
    }));
    const nodeById = Object.fromEntries(nodeData.map((n) => [n.id, n]));
    const linkData = LINKS.map((l) => ({
      ...l,
      sourceId: l.source,
      targetId: l.target,
      source: nodeById[l.source],
      target: nodeById[l.target],
    })).filter((l) => l.source && l.target);

    const g = svg.append("g");

    // Zoom & pan
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.35, 3])
        .filter((e) => e.type !== "click")
        .on("zoom", (e) => g.attr("transform", e.transform))
    );

    // ── Hull zones ──────────────────────────────────────
    const cats = Object.keys(CAT_COLOR);

    const hullPaths = g
      .append("g")
      .selectAll("path")
      .data(cats)
      .join("path")
      .attr("fill", (cat) => CAT_COLOR[cat] + "15")
      .attr("stroke", (cat) => CAT_COLOR[cat])
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4)
      .attr("stroke-dasharray", "5,3")
      .attr("pointer-events", "none");

    const hullLabels = g
      .append("g")
      .selectAll("text")
      .data(cats)
      .join("text")
      .text((cat) => CAT_LABEL[cat].toUpperCase())
      .attr("font-size", 9)
      .attr("font-weight", "700")
      .attr("letter-spacing", "0.07em")
      .attr("fill", (cat) => CAT_COLOR[cat])
      .attr("fill-opacity", 0.55)
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none");

    function hullPath(cat) {
      const pts = nodeData.filter((n) => n.cat === cat).map((n) => [n.x, n.y]);
      if (pts.length < 2) return "";
      let raw =
        pts.length < 3
          ? d3.polygonHull([
              ...pts,
              [
                (pts[0][0] + pts[1][0]) / 2 - 10,
                (pts[0][1] + pts[1][1]) / 2 - 10,
              ],
              [
                (pts[0][0] + pts[1][0]) / 2 + 10,
                (pts[0][1] + pts[1][1]) / 2 + 10,
              ],
            ])
          : d3.polygonHull(pts);
      if (!raw) return "";
      const cx = d3.mean(raw, (p) => p[0]);
      const cy = d3.mean(raw, (p) => p[1]);
      const expanded = raw.map((p) => {
        const dx = p[0] - cx,
          dy = p[1] - cy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        return [p[0] + (dx / len) * 32, p[1] + (dy / len) * 32];
      });
      return (
        "M" +
        expanded.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") +
        "Z"
      );
    }

    function labelPos(cat) {
      const pts = nodeData.filter((n) => n.cat === cat);
      return {
        x: d3.mean(pts, (n) => n.x),
        y: d3.min(pts, (n) => n.y) - 30,
      };
    }

    const OSI_SHORT = {
      L7: "Application",
      L6: "Presentation",
      L5: "Session",
      L4: "Transport",
      L3: "Network",
      L2: "Data Link",
      L1: "Physical",
    };
    const nodeRadius = (n) => (n.cat === "osi" ? 28 : R);

    // ── Links ───────────────────────────────────────────
    // OSI chain links (label "above") rendered as thick backbone
    const chainSel = g
      .append("g")
      .selectAll("line")
      .data(linkData.filter((l) => l.label === "above"))
      .join("line")
      .attr("stroke", CAT_COLOR.osi)
      .attr("stroke-width", 4)
      .attr("stroke-opacity", 0.35)
      .attr("pointer-events", "none");

    const linkSel = g
      .append("g")
      .selectAll("line")
      .data(linkData.filter((l) => l.label !== "above"))
      .join("line")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1)
      .attr("marker-end", "url(#arr-dim)");

    // ── Nodes ───────────────────────────────────────────
    const nodeSel = g
      .append("g")
      .selectAll("g")
      .data(nodeData)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag()
          .on("start", (ev, d) => {
            if (!ev.active) simRef.current.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (ev, d) => {
            d.fx = ev.x;
            d.fy = ev.y;
          })
          .on("end", (ev, d) => {
            if (!ev.active) simRef.current.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Regular nodes — circle
    nodeSel
      .filter((d) => d.cat !== "osi")
      .append("circle")
      .attr("class", "node-bg")
      .attr("r", R)
      .attr("fill", (d) => CAT_COLOR[d.cat] + "18")
      .attr("stroke", (d) => CAT_COLOR[d.cat])
      .attr("stroke-width", 1.5);

    nodeSel
      .filter((d) => d.cat !== "osi")
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d) => (d.id.length > 5 ? 7 : 8.5))
      .attr("font-weight", "700")
      .attr("fill", (d) => CAT_COLOR[d.cat])
      .attr("pointer-events", "none");

    // OSI nodes — solid rounded rect card
    const osiSel = nodeSel.filter((d) => d.cat === "osi");

    osiSel
      .append("rect")
      .attr("class", "node-bg")
      .attr("x", -30)
      .attr("y", -19)
      .attr("width", 60)
      .attr("height", 38)
      .attr("rx", 9)
      .attr("fill", CAT_COLOR.osi)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.3);

    // Layer number e.g. "L7"
    osiSel
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.15em")
      .attr("font-size", 12)
      .attr("font-weight", "800")
      .attr("fill", "#fff")
      .attr("pointer-events", "none");

    // Layer name e.g. "Application"
    osiSel
      .append("text")
      .text((d) => OSI_SHORT[d.id] || "")
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .attr("font-size", 6.5)
      .attr("font-weight", "600")
      .attr("fill", "rgba(255,255,255,0.8)")
      .attr("pointer-events", "none");

    // ── Highlight logic ─────────────────────────────────
    function highlight(d) {
      if (!d) {
        linkSel
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 1)
          .attr("marker-end", "url(#arr-dim)");
        chainSel.attr("stroke-opacity", 0.35);
        nodeSel
          .selectAll(".node-bg")
          .attr("fill", (n) =>
            n.cat === "osi" ? CAT_COLOR.osi : CAT_COLOR[n.cat] + "18"
          )
          .attr("stroke-opacity", 1)
          .attr("r", (n) => (n.cat !== "osi" ? R : null));
        nodeSel.selectAll("text").attr("fill-opacity", 1);
        hullPaths.attr("fill-opacity", 0.15).attr("stroke-opacity", 0.4);
        hullLabels.attr("fill-opacity", 0.55);
        return;
      }
      const conn = new Set([d.id]);
      linkData.forEach((l) => {
        if (l.sourceId === d.id) conn.add(l.targetId);
        if (l.targetId === d.id) conn.add(l.sourceId);
      });
      linkSel
        .attr("stroke", (l) =>
          l.sourceId === d.id || l.targetId === d.id ? CAT_COLOR[d.cat] : "#eee"
        )
        .attr("stroke-width", (l) =>
          l.sourceId === d.id || l.targetId === d.id ? 2 : 1
        )
        .attr("stroke-opacity", (l) =>
          l.sourceId === d.id || l.targetId === d.id ? 1 : 0.2
        )
        .attr("marker-end", (l) =>
          l.sourceId === d.id || l.targetId === d.id
            ? `url(#arr-${d.cat})`
            : "url(#arr-dim)"
        );
      chainSel.attr("stroke-opacity", (l) =>
        l.sourceId === d.id || l.targetId === d.id ? 0.9 : 0.1
      );
      nodeSel
        .selectAll(".node-bg")
        .attr("fill", (n) => {
          if (n.cat === "osi")
            return conn.has(n.id) ? CAT_COLOR.osi : CAT_COLOR.osi + "44";
          return conn.has(n.id)
            ? CAT_COLOR[n.cat] + "35"
            : CAT_COLOR[n.cat] + "08";
        })
        .attr("stroke-opacity", (n) => (conn.has(n.id) ? 1 : 0.2))
        .attr("r", (n) =>
          n.cat !== "osi" ? (n.id === d.id ? R + 3 : R) : null
        );
      nodeSel
        .selectAll("text")
        .attr("fill-opacity", (n) => (conn.has(n.id) ? 1 : 0.15));
      hullPaths
        .attr("fill-opacity", (cat) => (cat === d.cat ? 0.2 : 0.04))
        .attr("stroke-opacity", (cat) => (cat === d.cat ? 0.6 : 0.1));
      hullLabels.attr("fill-opacity", (cat) => (cat === d.cat ? 0.8 : 0.15));
    }

    highlightFnRef.current = { highlight };

    nodeSel.on("click", (ev, d) => {
      ev.stopPropagation();
      if (selectedRef.current?.id === d.id) {
        selectedRef.current = null;
        setSelected(null);
        highlight(null);
      } else {
        selectedRef.current = d;
        setSelected({ ...d });
        highlight(d);
      }
    });
    svg.on("click", () => {
      selectedRef.current = null;
      setSelected(null);
      highlight(null);
    });

    highlightRef.current = (node) => {
      const found = nodeData.find((n) => n.id === node.id);
      if (found) highlight(found);
    };

    // ── Force simulation ────────────────────────────────
    simRef.current = d3
      .forceSimulation(nodeData)
      .force(
        "link",
        d3
          .forceLink(linkData)
          .id((n) => n.id)
          .distance(58)
          .strength(0.14)
      )
      .force("charge", d3.forceManyBody().strength(-230))
      .force(
        "collide",
        d3.forceCollide((n) => nodeRadius(n) + 11)
      )
      .force(
        "x",
        d3
          .forceX((n) => CLUSTER[n.cat].x)
          .strength((n) => (n.cat === "osi" ? 0.9 : 0.5))
      )
      .force(
        "y",
        d3
          .forceY((n) =>
            n.cat === "osi" ? OSI_Y[n.id] || 300 : CLUSTER[n.cat].y
          )
          .strength((n) => (n.cat === "osi" ? 0.95 : 0.5))
      )
      .force("bound", () => {
        nodeData.forEach((n) => {
          const minX = n.cat === "osi" ? 10 : PAD;
          n.x = Math.max(minX, Math.min(W - PAD, n.x));
          n.y = Math.max(PAD, Math.min(H - PAD, n.y));
        });
      })
      .on("tick", () => {
        const edgeX2 = (l) => {
          const dx = l.target.x - l.source.x,
            dy = l.target.y - l.source.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          return l.target.x - (dx / len) * (nodeRadius(l.target) + 6);
        };
        const edgeY2 = (l) => {
          const dx = l.target.x - l.source.x,
            dy = l.target.y - l.source.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          return l.target.y - (dy / len) * (nodeRadius(l.target) + 6);
        };
        chainSel
          .attr("x1", (l) => l.source.x)
          .attr("y1", (l) => l.source.y)
          .attr("x2", edgeX2)
          .attr("y2", edgeY2);
        linkSel
          .attr("x1", (l) => l.source.x)
          .attr("y1", (l) => l.source.y)
          .attr("x2", edgeX2)
          .attr("y2", edgeY2);
        nodeSel.attr("transform", (n) => `translate(${n.x},${n.y})`);
        hullPaths.attr("d", (cat) => hullPath(cat));
        hullLabels.each(function (cat) {
          const pos = labelPos(cat);
          d3.select(this).attr("x", pos.x).attr("y", pos.y);
        });
      });

    return () => simRef.current?.stop();
  }, [mode]);

  const relatedLinks = selected
    ? LINKS.filter((l) => l.source === selected.id || l.target === selected.id)
    : [];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fff" }}>
      {/* Top bar: Search + Toggle */}
      <div
        style={{
          padding: "8px 14px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            background: "#f0f0f0",
            borderRadius: 8,
            padding: 2,
            flexShrink: 0,
          }}
        >
          {["graph", "quiz", "learn", "ports"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "5px 14px",
                borderRadius: 6,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "#111" : "#999",
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
              }}
            >
              {m === "graph"
                ? "🗺 Graph"
                : m === "quiz"
                ? "🧠 Quiz"
                : m === "learn"
                ? "📚 Learn"
                : "🔌 Ports"}
            </button>
          ))}
        </div>
        <div
          style={{
            position: "relative",
            flex: 1,
            display:
              mode === "ports" || mode === "learn" || mode === "quiz"
                ? "none"
                : "block",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "#aaa",
              zIndex: 1,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search && setShowResults(true)}
            placeholder="Search acronym..."
            style={{
              width: "100%",
              padding: "7px 12px 7px 32px",
              fontSize: 13,
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              outline: "none",
              background: "#f9f9f9",
              boxSizing: "border-box",
              color: "#111",
            }}
          />
          {search && (
            <span
              onClick={() => {
                setSearch("");
                setSearchResults([]);
                setShowResults(false);
                selectedRef.current = null;
                setSelected(null);
              }}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#aaa",
                fontSize: 16,
                zIndex: 1,
              }}
            >
              ×
            </span>
          )}
          {showResults && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                zIndex: 200,
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
            >
              {searchResults.map((n) => (
                <div
                  key={n.id}
                  onClick={() => focusNode(n)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    borderBottom: "1px solid #f5f5f5",
                    background: "#fff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  <span
                    style={{
                      background: CAT_COLOR[n.cat] + "20",
                      color: CAT_COLOR[n.cat],
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: 5,
                      flexShrink: 0,
                    }}
                  >
                    {n.id}
                  </span>
                  <span style={{ fontSize: 12, color: "#555" }}>{n.full}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Legend */}
      {mode === "graph" && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px 12px",
            padding: "9px 14px",
            borderBottom: "1px solid #f0f0f0",
            alignItems: "center",
          }}
        >
          {Object.entries(CAT_LABEL).map(([cat, label]) => (
            <span
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#555",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: CAT_COLOR[cat],
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      )}

      {mode === "quiz" ? (
        <Quiz onBack={() => setMode("graph")} />
      ) : mode === "learn" ? (
        <Learn onBack={() => setMode("graph")} />
      ) : mode === "ports" ? (
        <Ports onBack={() => setMode("graph")} />
      ) : (
        <>
          {/* Graph */}
          <div style={{ position: "relative" }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              style={{
                width: "100%",
                height: H,
                display: "block",
                background: "#f9f9f9",
              }}
            />

            {/* Info panel */}
            {selected && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 205,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: "13px 14px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
                  maxHeight: H - 20,
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: CAT_COLOR[selected.cat] + "20",
                      color: CAT_COLOR[selected.cat],
                      fontSize: 13,
                      fontWeight: 800,
                      padding: "3px 9px",
                      borderRadius: 6,
                    }}
                  >
                    {selected.id}
                  </span>
                  <span
                    style={{
                      fontSize: 9.5,
                      color: "#aaa",
                      background: "#f5f5f5",
                      padding: "2px 7px",
                      borderRadius: 10,
                    }}
                  >
                    {CAT_LABEL[selected.cat]}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#111",
                    lineHeight: 1.4,
                    marginBottom: 5,
                  }}
                >
                  {selected.full}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#666",
                    lineHeight: 1.55,
                    marginBottom: 12,
                  }}
                >
                  {selected.desc}
                </div>
                {relatedLinks.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#bbb",
                        letterSpacing: "0.07em",
                        marginBottom: 7,
                        textTransform: "uppercase",
                      }}
                    >
                      Connections
                    </div>
                    {relatedLinks.map((l, i) => {
                      const isOut = l.source === selected.id;
                      const other = isOut ? l.target : l.source;
                      const otherNode = NODES.find((n) => n.id === other);
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                            marginBottom: 6,
                            paddingBottom: 6,
                            borderBottom:
                              i < relatedLinks.length - 1
                                ? "1px solid #f5f5f5"
                                : "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isOut ? CAT_COLOR[selected.cat] : "#999",
                              minWidth: 14,
                              paddingTop: 1,
                            }}
                          >
                            {isOut ? "→" : "←"}
                          </span>
                          <div>
                            <span
                              style={{
                                fontSize: 11.5,
                                fontWeight: 700,
                                color: otherNode
                                  ? CAT_COLOR[otherNode.cat]
                                  : "#333",
                              }}
                            >
                              {other}
                            </span>
                            <span style={{ fontSize: 10.5, color: "#aaa" }}>
                              {" "}
                              · {l.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
          <div
            style={{
              padding: "6px 14px",
              fontSize: 10.5,
              color: "#ccc",
              textAlign: "center",
            }}
          >
            Click a node to explore connections · Drag to reposition · Scroll to
            zoom
          </div>
        </>
      )}
    </div>
  );
}
