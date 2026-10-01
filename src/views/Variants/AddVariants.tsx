import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
}

const AddVariant = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const adminToken = localStorage.getItem("adminToken");

  const [products, setProducts] = useState<Product[]>([]);

  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [stock, setStock] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saving, setSaving] = useState(false);


  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/product`
        );

        const productData =
          response.data?.products ||
          response.data?.data ||
          [];

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );
      } catch (error: any) {
        console.error(
          "Fetch products error:",
          error
        );

        toast.error(
          "Failed to load products"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);


  // =========================================================
  // IMAGE SELECT
  // =========================================================

  const handleImages = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    ).slice(0, 5);

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };


  const removeImage = (index: number) => {
    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setPreviewImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!product) {
      toast.error(
        "Please select a product"
      );
      return;
    }

    if (!name.trim()) {
      toast.error(
        "Variant name is required"
      );
      return;
    }

    if (!sku.trim()) {
      toast.error(
        "SKU is required"
      );
      return;
    }

    if (
      price === "" ||
      Number(price) < 0
    ) {
      toast.error(
        "Please enter a valid price"
      );
      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      toast.error(
        "Please enter a valid stock"
      );
      return;
    }

    if (
      Number(discountPercent) < 0 ||
      Number(discountPercent) > 100
    ) {
      toast.error(
        "Discount must be between 0 and 100"
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "product",
        product
      );

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "sku",
        sku.trim().toUpperCase()
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "discountPercent",
        discountPercent
      );

      formData.append(
        "stock",
        stock
      );

      formData.append(
        "isActive",
        String(isActive)
      );

      images.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      await axios.post(
        `${API_URL}/api/variant/admin`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(
        "Variant created successfully"
      );

      navigate(
        "/variants"
      );
    } catch (error: any) {
      console.error(
        "Create variant error:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to create variant"
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/variants"
            )
          }
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Add Variant
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a color or other variant to an existing product.
          </p>
        </div>

      </div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
      >

        {/* PRODUCT */}
        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product
          </label>

          <select
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            disabled={loadingProducts}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-green-500"
          >
            <option value="">
              {loadingProducts
                ? "Loading products..."
                : "Select Product"}
            </option>

            {products.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))}
          </select>

        </div>


        {/* VARIANT NAME + SKU */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Variant Name / Color
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Example: Black"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              SKU
            </label>

            <input
              type="text"
              value={sku}
              onChange={(e) =>
                setSku(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="Example: OST-BLK-001"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm uppercase outline-none focus:border-green-500"
            />

          </div>

        </div>


        {/* PRICE / DISCOUNT / STOCK */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="4999"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Discount %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Stock
            </label>

            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              placeholder="20"
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
            />

          </div>

        </div>


        {/* IMAGES */}
        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Variant Images
          </label>

          <p className="mb-3 text-xs text-gray-500">
            Upload images specific to this variant/color.
            Maximum 5 images.
          </p>

          <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-4 transition hover:bg-gray-50">

            <Upload
              size={26}
              className="text-gray-400"
            />

            <span className="mt-2 text-sm text-gray-600">
              Click to upload variant images
            </span>

            <span className="mt-1 text-xs text-gray-400">
              JPG, PNG, WEBP
            </span>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImages}
            />

          </label>


          {/* PREVIEW */}
          {previewImages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">

              {previewImages.map(
                (image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative"
                  >

                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute -right-2 -top-2 rounded-full bg-black p-1 text-white"
                    >
                      <X size={13} />
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>


        {/* STATUS */}
        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(
                e.target.checked
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-700">
            Active
          </span>

        </label>


        {/* BUTTONS */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/variants"
              )
            }
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create Variant"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddVariant;