"use client";

import { Course, Category } from "@prisma/client";
import Image from "next/image";
import { LuUsers, LuClock, LuVideo } from "react-icons/lu";
import AddToCartButton from "@/components/utils/AddToCartButton";
import DoctorExplanationVideo from "@/components/courses/doctorExplanationVideo";
import { Suspense } from "react";

interface CryptoHeroProps {
    course: Course & {
        category: Category | null;
        _count?: {
            enrollments?: number;
            comments?: number;
        };
    };
    finalPrice: number;
}

export const CryptoHero = ({ course, finalPrice }: CryptoHeroProps) => {
    return (
        <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-[#0B0E14] text-white">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
                <div className="absolute inset-0 bg-[url('/images/utiles/grid-pattern.svg')] opacity-20" />
            </div>

            <div className="container-xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <div className="space-y-8 order-2 lg:order-1">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-amber-400 text-sm font-bold tracking-wide">
                                دوره تخصصی ارز دیجیتال
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            {course.subject}
                        </h1>

                        {/* Description */}
                        {course.description && (
                            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                                {course.description}
                            </p>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs">دانشجویان</span>
                                <div className="flex items-center gap-2 text-white">
                                    <LuUsers className="text-amber-500" size={18} />
                                    <span className="font-bold text-lg">
                                        {course._count?.enrollments || course.students || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs">مدت دوره</span>
                                <div className="flex items-center gap-2 text-white">
                                    <LuClock className="text-purple-500" size={18} />
                                    <span className="font-bold text-lg">{course.time || "نامشخص"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs">تعداد ویدیو</span>
                                <div className="flex items-center gap-2 text-white">
                                    <LuVideo className="text-blue-500" size={18} />
                                    <span className="font-bold text-lg">{course.videosCount || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex flex-col gap-6 pt-4">
                            <div className="flex items-center gap-4">
                                {course.discountPercent && course.discountPercent > 0 ? (
                                    <>
                                        <span className="text-4xl font-bold text-white">
                                            {finalPrice.toLocaleString("fa-IR")} <span className="text-lg text-gray-500 font-normal">تومان</span>
                                        </span>
                                        <div className="flex flex-col items-start">
                                            <span className="text-lg line-through text-gray-600">
                                                {course.price.toLocaleString("fa-IR")}
                                            </span>
                                            <span className="text-xs text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">
                                                {course.discountPercent}٪ تخفیف
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-white">
                                        {course.price.toLocaleString("fa-IR")} <span className="text-lg text-gray-500 font-normal">تومان</span>
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <Suspense
                                    fallback={
                                        <div className="w-40 h-14 animate-pulse bg-white/10 rounded-xl" />
                                    }
                                >
                                    <AddToCartButton course={course} />
                                </Suspense>
                                <DoctorExplanationVideo />
                            </div>
                        </div>
                    </div>

                    {/* Right: Image (3D Effect) */}
                    <div className="relative order-1 lg:order-2 flex justify-center">
                        <div className="relative w-full max-w-[500px] aspect-square">
                            {/* Glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" />

                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900/50 backdrop-blur-sm p-2">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                    <Image
                                        src={course.img || "/images/default-course.jpg"}
                                        alt={course.subject}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Floating Crypto Icons */}
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#F7931A] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 animate-bounce delay-700">
                                <span className="text-white font-bold text-2xl">₿</span>
                            </div>
                            <div className="absolute -bottom-8 -left-4 w-14 h-14 bg-[#627EEA] rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 animate-bounce delay-1000">
                                <span className="text-white font-bold text-xl">Ξ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
