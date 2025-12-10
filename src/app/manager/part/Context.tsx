"use client";

import {
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaUserCircle, FaCog, FaChartLine } from "react-icons/fa";
import Image from "next/image";

import croissant from "../../../../public/newItems/croissant.jpg";
type Props = {};

const Context = (props: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handlerLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      } else {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <CircularProgress color="error" size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* User Profile Card */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "#ef4444",
                    fontSize: "1.25rem",
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Welcome Back!
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <FaUserCircle className="text-red-500 text-xs" />
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handlerLogout}
                variant="contained"
                color="error"
                size="small"
                startIcon={<FaSignOutAlt />}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-600">Welcome to your management portal</p>
        </div>

        {/* User Profile Card */}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-12 gap-6 ">
          <div className="col-span-6 bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg">
            {/* Section Header */}
            <div className="flex items-center justify-center w-full ">
              <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
              <div className="px-6 text-center">
                <h2 className="text-xl  font-bold text-red-700 whitespace-nowrap">
                  Taste What's New
                </h2>
              </div>
              <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
            </div>

            {/* Main Content */}
            <div className="">
              {/* Content Section */}

              {/* Description */}
              <div className="bg-gradient-to-r my-3 from-green-50 to-orange-50 border-l-4 border-green-500 p-6 rounded-lg space-y-4">
                <p className="text-gray-800 leading-relaxed text-lg ">
                  Introducing our Croissant Sandwich — a buttery, flaky delight
                  with a touch of sweetness. Freshly baked and perfect with
                  coffee or tea. A must-try for pastry lovers!
                </p>
              </div>

              {/* Image Section */}
              <div className="relative order-2 lg:order-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <Image
                    src={croissant}
                    alt="Special New Item"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* New Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    NEW!
                  </div>

                  {/* Special Offer Badge */}
                  {/* <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Limited Time
            </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Context;
