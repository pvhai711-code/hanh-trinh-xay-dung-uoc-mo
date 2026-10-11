import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();

app.use(express.json({ limit: '10mb' }));

// Ensure CORS and JSON headers are always present
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Directory for persistent server storage
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create data directory (normal in read-only serverless):', err);
  }
}

const CONFIG_FILE = path.join(DATA_DIR, 'questions_config.json');

// In-memory fallback if filesystem is read-only (e.g., Vercel serverless /tmp)
let inMemoryQuestions: any = null;

// Admin credentials setup
// Default account: 0985581681, initial password: thptvtt
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '0985581681';
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || 'thptvtt';

// Hash password with SHA-256 for secure server-side comparison
function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

const ADMIN_PASSWORD_HASH = hashPassword(ADMIN_PASSWORD_PLAIN);

// In-memory session tokens for admin
const validTokens = new Set<string>();

function generateToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  return token;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Chưa được cấp quyền truy cập' });
  }

  const token = authHeader.split(' ')[1];
  if (!validTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ' });
  }

  next();
}

// Handler logic for Login (supporting both /api/admin/login and /api/login and /api/auth/login)
const handleLogin = (req: Request, res: Response) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp đầy đủ tài khoản và mật khẩu',
    });
  }

  const isUserMatch = String(username).trim() === ADMIN_USERNAME.trim();
  const isPassMatch = hashPassword(String(password).trim()) === ADMIN_PASSWORD_HASH;

  if (!isUserMatch || !isPassMatch) {
    return res.status(401).json({
      success: false,
      message: 'Tài khoản hoặc mật khẩu không chính xác',
    });
  }

  const token = generateToken();
  return res.status(200).json({
    success: true,
    token,
    message: 'Đăng nhập thành công',
  });
};

// 1. Admin Login API Routes (Supports relative paths requested)
app.post('/api/admin/login', handleLogin);
app.post('/api/login', handleLogin);
app.post('/api/auth/login', handleLogin);
app.post('/api/auth', handleLogin);

// 2. Admin Logout API Routes
const handleLogout = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    validTokens.delete(token);
  }
  return res.status(200).json({ success: true, message: 'Đã đăng xuất' });
};
app.post('/api/admin/logout', requireAdmin, handleLogout);
app.post('/api/logout', requireAdmin, handleLogout);

// 3. Get Questions (Public for students, returns saved questions config or null)
app.get('/api/questions', (req: Request, res: Response) => {
  try {
    if (inMemoryQuestions) {
      return res.status(200).json(inMemoryQuestions);
    }
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  // Return null or empty if file doesn't exist yet, client will use default
  return res.status(200).json(null);
});

// 4. Save Questions (Admin Only)
app.post('/api/admin/questions', requireAdmin, (req: Request, res: Response) => {
  try {
    const questions = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    inMemoryQuestions = questions;

    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(questions, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Could not persist to file system (serverless environment):', fsErr);
    }

    return res.status(200).json({ success: true, count: questions.length });
  } catch (err) {
    console.error('Error saving config file:', err);
    return res.status(500).json({ success: false, message: 'Lỗi ghi tệp cấu hình trên máy chủ' });
  }
});

// 5. Restore Default Questions (Admin Only)
app.post('/api/admin/reset', requireAdmin, (req: Request, res: Response) => {
  try {
    inMemoryQuestions = null;
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        fs.unlinkSync(CONFIG_FILE);
      } catch (fsErr) {
        console.warn('Could not delete file in serverless environment:', fsErr);
      }
    }
    return res.status(200).json({ success: true, message: 'Đã khôi phục cấu hình mặc định' });
  } catch (err) {
    console.error('Error removing config file:', err);
    return res.status(500).json({ success: false, message: 'Lỗi khi khôi phục cấu hình' });
  }
});

// Catch-all for undefined /api/* routes to ALWAYS return JSON with proper 404 status (Never return HTML!)
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Đường dẫn API '${req.originalUrl}' không tồn tại.`,
  });
});

// Global error handler guaranteeing JSON output
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi máy chủ nội bộ',
    error: err?.message || String(err),
  });
});
