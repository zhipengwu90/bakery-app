"use client";

import {
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Backdrop, // added
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
  FaChartLine,
  FaEdit,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import Image from "next/image";
import uploadNewItem from "@/app/utils/sql/updateNewItem";
import croissant from "../../../../public/newItems/croissant.jpg";
type Props = {};

const Context = (props: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleOpenEdit = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const result = await uploadNewItem(
        selectedImage,
        editTitle,
        editDescription
      );
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Saved successfully.",
          severity: "success",
        });
        await getData();
        setOpenEditDialog(false);
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Save failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "Save failed.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const getData = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from("brazen_page").select("*");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      //find the data with type 'newItem'
      const newItem = data.find((item) => item.type === "newItem");
      setNewItemData(newItem);
    }
  };

  useEffect(() => {
    fetchUser();
    getData();
  }, []);

  useEffect(() => {
    if (newItemData) {
      setEditTitle(newItemData.title || "");
      setEditDescription(newItemData.description || "");
    }
  }, [newItemData, openEditDialog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <CircularProgress color="error" size={60} />
      </div>
    );
  }

  const handleDeleteCurrentImage = async () => {
    if (!confirm("Are you sure you want to delete the current image?")) return;
    setDeleting(true);
    try {
      const supabase = await createClient();
      if (newItemData?.img_filename) {
        const { error: delErr } = await supabase.storage
          .from("brazen_page")
          .remove([newItemData.img_filename]);
        if (delErr) throw delErr;
      }
      const updateData = { img_url: null, file_path: null };
      const { error: updateErr } = await supabase
        .from("brazen_page")
        .update(updateData)
        .eq("type", "newItem")
        .eq("id", 1);
      if (updateErr) throw updateErr;

      setNewItemData({ ...newItemData, img_url: null });
      setSnackbar({
        open: true,
        message: "Image deleted.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Delete failed.", severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

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

        {/* Quick Actions Grid - new item */}
        <div className="grid grid-cols-12 gap-6 ">
          <div className="col-span-6  lg:col-span-6  md:col-span-12 sm:col-span-12 bg-white border-2 border-red-100 rounded-lg p-6 shadow-lg relative">
            {/* Edit Button in Corner */}
            <IconButton
              onClick={handleOpenEdit}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#ef4444",
                color: "white",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#dc2626",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s ease",
                boxShadow: 2,
              }}
            >
              <FaEdit />
            </IconButton>

            {/* Section Header */}
            <div className="flex items-center justify-center w-full ">
              <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
              <div className="px-6 text-center">
                <h2 className="text-xl  font-bold text-red-700 whitespace-nowrap">
                  {newItemData ? newItemData.title : ""}
                </h2>
              </div>
              <div className="flex-grow border-t-2 border-red-700 max-w-24"></div>
            </div>

            {/* Main Content */}
            <div className="">
              {/* Description */}
              <div className="bg-gradient-to-r my-3 from-green-50 to-orange-50 border-l-4 border-green-500 p-6 rounded-lg space-y-4">
                <p className="text-gray-800 leading-relaxed text-lg ">
                  {newItemData ? newItemData.description : ""}
                </p>
              </div>

              {/* Image Section */}
              <div className="relative order-2 lg:order-1">
                {newItemData && newItemData.img_url ? (
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <Image
                      src={newItemData.img_url}
                      width={600}
                      height={400}
                      alt="Special New Item"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* New Badge */}
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      NEW!
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog Popup */}
      <Dialog
        open={openEditDialog}
        // onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle
          sx={{ bgcolor: "#ef4444", color: "white", fontWeight: "bold" }}
        >
          <div className="flex items-center gap-2">
            <FaEdit />
            Edit New Item Section
          </div>
        </DialogTitle>
        <DialogContent
          sx={{
            mt: 2,
            position: "relative", // allow overlay positioning
          }}
        >
          {(saving || deleting) && (
            <Backdrop
              open
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: (theme) => theme.zIndex.modal + 1,
                bgcolor: "rgba(0,0,0,0.45)",
                color: "#fff",
              }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          <div className="space-y-4 pt-2">
            <TextField
              label="Section Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#ef4444",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ef4444",
                },
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#ef4444",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ef4444",
                },
              }}
            />

            {/* Image Upload Section */}

            {newItemData && newItemData.img_url ? (
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Image
                </label>
                <div className="relative border-2 border-red-200 rounded-lg overflow-hidden">
                  <Image
                    src={newItemData.img_url}
                    width={600}
                    height={400}
                    alt="Current"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    Current Image
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCurrentImage()}
                    disabled={saving || deleting}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    title="Delete current image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Image
                </label>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<FaUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  sx={{
                    textTransform: "none",
                    py: 1.5,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      bgcolor: "#fef2f2",
                    },
                  }}
                >
                  {selectedImage ? "Change Image" : "Upload Image"}
                </Button>

                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative border-2 border-red-200 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                      {selectedImage?.name}
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                    <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Changes will be reflected immediately on
                the homepage.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseEdit}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "none",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            color="error"
            disabled={saving || deleting}
            sx={{
              textTransform: "none",
              px: 4,
              bgcolor: "#ef4444",
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Context;
