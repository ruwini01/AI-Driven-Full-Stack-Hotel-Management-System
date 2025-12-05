import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHotelByIdQuery, useUpdateHotelMutation } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { ArrowLeft, X, Plus, Trash } from "lucide-react";

const ALL_AMENITIES = [
"Free WiFi",
"Swimming Pool",
"Parking",
"Gym",
"Spa",
"Restaurant",
"Room Service",
"AC",
"Bar",
"TV",
"24h Front Desk",
];

export default function EditHotel() {
const navigate = useNavigate();
const { id } = useParams();
const { data: hotel, isLoading } = useGetHotelByIdQuery(id);
const [updateHotel] = useUpdateHotelMutation();


const [form, setForm] = useState({
    name: "",
    location: "",
    city: "",
    rating: 0,
    description: "",
    amenities: [],
    price: 0,
    stars: 0,
    images: [],
    roomTypes: [],
});

const [imageUrlInput, setImageUrlInput] = useState("");
const [dragItem, setDragItem] = useState(null);

const handleDragStart = (item) => setDragItem(item);
const handleDropSelected = () => {
    if (dragItem && !form.amenities.includes(dragItem)) {
        setForm({ ...form, amenities: [...form.amenities, dragItem] });
    }
    setDragItem(null);
};
const handleDropAvailable = () => {
    if (dragItem && form.amenities.includes(dragItem)) {
        setForm({
            ...form,
            amenities: form.amenities.filter((a) => a !== dragItem),
        });
    }
    setDragItem(null);
};

const addImageUrl = () => {
    if (imageUrlInput.trim() !== "") {
        setForm({ ...form, images: [...form.images, imageUrlInput.trim()] });
        setImageUrlInput("");
    }
};
const removeImage = (url) => {
    setForm({ ...form, images: form.images.filter((img) => img !== url) });
};

const addRoomType = () => {
    setForm({
        ...form,
        roomTypes: [...form.roomTypes, { name: "", price: "", available: "" }],
    });
};
const removeRoomType = (index) => {
    const updated = [...form.roomTypes];
    updated.splice(index, 1);
    setForm({ ...form, roomTypes: updated });
};
const updateRoomType = (index, field, value) => {
    const updated = [...form.roomTypes];
    updated[index][field] = field === "name" ? value : value === "" ? "" : Number(value);
    setForm({ ...form, roomTypes: updated });
};

useEffect(() => {
    if (hotel) setForm({ ...hotel });
}, [hotel]);

const submit = async () => {
    if (!form.name || !form.location || !form.city || !form.description) {
        toast.error("Please fill all required fields");
        return;
    }
    try {
        await updateHotel({ id: id, data: form }).unwrap();
        toast.success("Hotel Updated Successfully");
        navigate("/admin");
    } catch (e) {
        toast.error("Failed to update hotel");
    }
};

if (isLoading) return <p className="p-6">Loading...</p>;

return (
    <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition"
            >
                <ArrowLeft size={20} /> Back
            </button>

            <h1 className="text-2xl font-semibold mb-6">Edit Hotel</h1>

            <div className="bg-white dark:bg-neutral-900 shadow-md rounded-xl p-6 space-y-6 border">

                {/* BASIC FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="input"
                        placeholder="Hotel Name *"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Location *"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="City *"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Rating (0-5)"
                        type="number"
                        min="0"
                        max="5"
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    />
                    <input
                        className="input"
                        placeholder="Price *"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    />
                    <input
                        className="input"
                        placeholder="Stars (1-5)"
                        type="number"
                        min="1"
                        max="5"
                        value={form.stars}
                        onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                    />
                </div>

                <textarea
                    className="input min-h-32"
                    placeholder="Hotel Description *"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                {/* AMENITIES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                        className="p-3 border rounded-lg bg-neutral-50 dark:bg-neutral-800"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropAvailable}
                    >
                        <h2 className="font-semibold mb-2">Available Amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {ALL_AMENITIES.map((item) => (
                                <div
                                    key={item}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-sm cursor-move"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="p-3 border rounded-lg bg-blue-50 dark:bg-neutral-800"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropSelected}
                    >
                        <h2 className="font-semibold mb-2">Selected Amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {form.amenities.length === 0 && <p className="text-sm text-gray-500">Drag amenities here</p>}
                            {form.amenities.map((item) => (
                                <div
                                    key={item}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-200 dark:bg-blue-700 text-sm cursor-move"
                                >
                                    {item}
                                    <X
                                        className="cursor-pointer"
                                        size={16}
                                        onClick={() => setForm({ ...form, amenities: form.amenities.filter((a) => a !== item) })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* IMAGE URL INPUT */}
                <div>
                    <h2 className="font-semibold mb-2">Hotel Images (URLs)</h2>
                    <div className="flex gap-3">
                        <input
                            className="input flex-1"
                            placeholder="Enter image URL..."
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                        />
                        <button
                            onClick={addImageUrl}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Add
                        </button>
                    </div>
                    {form.images.length > 0 && (
                        <div className="flex gap-3 flex-wrap mt-4">
                            {form.images.map((img) => (
                                <div key={img} className="relative">
                                    <img src={img} className="w-24 h-24 object-cover rounded-lg border" />
                                    <X
                                        size={18}
                                        className="absolute -top-2 -right-2 bg-white border rounded-full cursor-pointer"
                                        onClick={() => removeImage(img)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ROOM TYPES */}
                <div className="space-y-4">
                    <h2 className="font-semibold mb-2">Room Types</h2>
                    {form.roomTypes.map((room, idx) => (
                        <div key={idx} className="p-4 border rounded-lg relative bg-gray-50 dark:bg-neutral-800">
                            <button
                                onClick={() => removeRoomType(idx)}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                            >
                                <Trash size={14} />
                            </button>
                            <div className="flex flex-col gap-2">
                                <input
                                    className="input"
                                    placeholder="Room Type"
                                    value={room.name}
                                    onChange={(e) => updateRoomType(idx, "name", e.target.value)}
                                />
                                <input
                                    className="input"
                                    placeholder="Price"
                                    type="number"
                                    value={room.price || ""}
                                    onChange={(e) => updateRoomType(idx, "price", e.target.value)}
                                />
                                <input
                                    className="input"
                                    placeholder="Available Number of Rooms"
                                    type="number"
                                    value={room.available || ""}
                                    onChange={(e) => updateRoomType(idx, "available", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addRoomType}
                        className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded"
                    >
                        <Plus size={16} /> Add Room Type
                    </button>
                </div>

                {/* SUBMIT */}
                <button
                    onClick={submit}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                    Update Hotel
                </button>

            </div>
        </div>
    </>
);


}
