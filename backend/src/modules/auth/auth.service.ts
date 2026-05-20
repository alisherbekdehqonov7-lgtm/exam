import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { DatabaseService } from "../../database/database.service";
import { IUser, IJwtPayload } from "../../common/interfaces";
import { generateId, now } from "../../common/utils/helpers";
import { LoginDto, RegisterDto } from "./dto";

const JWT_SECRET = process.env.JWT_SECRET || "bookhaven_secret_key_2025";
const JWT_EXPIRES_IN = "7d";

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterDto) {
    // Validate
    if (!dto.fullName || !dto.email || !dto.password) {
      throw new BadRequestException("All fields are required");
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    if (dto.password.length < 6) {
      throw new BadRequestException("Password must be at least 6 characters");
    }

    // Check if email already exists
    const existing = this.db.findOne<IUser>(
      "users",
      (u) => u.email === dto.email,
    );
    if (existing) {
      throw new BadRequestException("Email is already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Create user
    const user: IUser = {
      id: generateId("usr"),
      fullName: dto.fullName,
      username: dto.email.split("@")[0],
      email: dto.email,
      password: hashedPassword,
      bio: "",
      phone: "",
      country: "",
      avatar: null,
      role: "user",
      createdAt: now(),
      updatedAt: now(),
    };

    this.db.insertOne("users", user);

    // Generate token
    const token = this.generateToken(user);

    return {
      message: "Registration successful",
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException("Email and password are required");
    }

    // Find user
    const user = this.db.findOne<IUser>("users", (u) => u.email === dto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // Check password
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      message: "Login successful",
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Get current user profile from token
   */
  getProfile(userId: string) {
    const user = this.db.findOne<IUser>("users", (u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.sanitizeUser(user);
  }

  // ---- Helpers ----

  private generateToken(user: IUser): string {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private sanitizeUser(user: IUser) {
    const { password, ...rest } = user;
    return rest;
  }
}
