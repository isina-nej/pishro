// @/lib/api-response.ts
import { NextResponse } from "next/server";

/**
 * Standard API Response Types
 * Based on JSend specification: https://github.com/omniti-labs/jsend
 */

/**
 * CORS Configuration
 * لیست originهای مجاز برای CORS
 */
export const ALLOWED_ORIGINS = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://pishro-admin.vercel.app",
  "https://pishro-0.vercel.app",
  "https://178.239.147.136:3001",
  "http://178.239.147.136:3001",
  "https://admin.pishrosarmaye.com",
  "http://admin.pishrosarmaye.com",
  "https://pishrosarmaye.com",
  "http://pishrosarmaye.com",
  "https://www.pishrosarmaye.com",
  "http://www.pishrosarmaye.com",
  "https://teh-1.s3.poshtiban.com"
];

/**
 * CORS Headers Helper
 * اضافه کردن CORS headers به NextResponse
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  const allowedOrigin = isAllowedOrigin ? origin : ALLOWED_ORIGINS[0];

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export type ApiStatus = "success" | "fail" | "error";

export interface ApiSuccessResponse<T = unknown> {
  status: "success";
  data: T;
  message?: string;
}

export interface ApiFailResponse {
  status: "fail";
  data: {
    [key: string]: string | string[];
  };
  message?: string;
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiFailResponse
  | ApiErrorResponse;

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Success Response Helper
 * Use for successful operations (2xx)
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = HttpStatus.OK
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      status: "success",
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}

/**
 * Fail Response Helper
 * Use for client errors (4xx) - validation errors, missing fields, etc.
 */
export function failResponse(
  data: { [key: string]: string | string[] },
  message?: string,
  statusCode: number = HttpStatus.BAD_REQUEST
): NextResponse<ApiFailResponse> {
  return NextResponse.json(
    {
      status: "fail",
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  );
}

/**
 * Error Response Helper
 * Use for server errors (5xx) or unexpected errors
 */
export function errorResponse(
  message: string,
  code?: string,
  details?: unknown,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      status: "error",
      message,
      ...(code && { code }),
      ...(typeof details === "object" && details !== null && { details }),
    },
    { status: statusCode }
  );
}

/**
 * Validation Error Response
 * Shorthand for validation failures
 */
export function validationError(
  fields: { [key: string]: string | string[] },
  message: string = "Validation failed"
): NextResponse<ApiFailResponse> {
  return failResponse(fields, message, HttpStatus.UNPROCESSABLE_ENTITY);
}

/**
 * Unauthorized Response
 * Shorthand for authentication failures
 */
export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<ApiFailResponse> {
  return failResponse({ auth: message }, message, HttpStatus.UNAUTHORIZED);
}

/**
 * Not Found Response
 * Shorthand for resource not found
 */
export function notFoundResponse(
  resource: string = "Resource",
  message?: string
): NextResponse<ApiFailResponse> {
  const msg = message || `${resource} not found`;
  return failResponse(
    { [resource.toLowerCase()]: msg },
    msg,
    HttpStatus.NOT_FOUND
  );
}

/**
 * Forbidden Response
 * Shorthand for permission denied
 */
export function forbiddenResponse(
  message: string = "Access forbidden"
): NextResponse<ApiFailResponse> {
  return failResponse({ permission: message }, message, HttpStatus.FORBIDDEN);
}

/**
 * Conflict Response
 * Shorthand for conflicts (e.g., duplicate entries)
 */
export function conflictResponse(
  resource: string,
  message?: string
): NextResponse<ApiFailResponse> {
  const msg = message || `${resource} already exists`;
  return failResponse(
    { [resource.toLowerCase()]: msg },
    msg,
    HttpStatus.CONFLICT
  );
}

/**
 * Paginated Response Helper
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export function paginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): NextResponse<ApiSuccessResponse<PaginatedData<T>>> {
  const totalPages = Math.ceil(total / limit);

  return successResponse<PaginatedData<T>>(
    {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
    message
  );
}

/**
 * Created Response Helper
 * Use when a resource is successfully created
 */
export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, HttpStatus.CREATED);
}

/**
 * No Content Response Helper
 * Use when operation is successful but there's no data to return
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: HttpStatus.NO_CONTENT });
}

/**
 * Error code constants
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  FORBIDDEN: "FORBIDDEN",

  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",

  // Business Logic
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  ALREADY_ENROLLED: "ALREADY_ENROLLED",
  ORDER_ALREADY_PAID: "ORDER_ALREADY_PAID",
  PAYMENT_FAILED: "PAYMENT_FAILED",

  // System
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  SMS_SEND_FAILED: "SMS_SEND_FAILED",

  // OTP
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_INVALID: "OTP_INVALID",
  OTP_SEND_FAILED: "OTP_SEND_FAILED",
} as const;
