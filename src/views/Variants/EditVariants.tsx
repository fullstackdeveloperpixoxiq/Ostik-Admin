import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router";
import { toast } from "sonner";

interface Variant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  discountPercent: number;
  stock: number;
  images: string[];
  isActive: boolean;
  product?: {
    _id: string;
    name: string;
    slug: string;
  };
}

const EditVariant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL =
    import.meta.env.VITE_API_URL;

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  const [variant, setVariant] =
    useState<Variant | null>(null);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] =
    useState("0");
  const [stock, setStock] = useState("");
  const [isActive, setIsActive] =
    useState(true);

  const [images, setImages] =
    useState<File[]>([]);

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  const [existingImages, setExistingImages] =
    useState<string[]>([]);  

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // =========================================================
  // FETCH VARIANT
  // =========================================================

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const response =
          await axios.get(
            `${API_URL}/api/variant/admin/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${adminToken}`,
              },
            }
          );

        const data =
          response.data?.variant;

        if (!data) {
          toast.error(
            "Variant not found"
          );
          return;
        }

        setVariant(data);

        setExistingImages(data.images || [] )

        setName(data.name || "");
        setSku(data.sku || "");
        setPrice(
          String(data.price ?? "")
        );
        setDiscountPercent(
          String(
            data.discountPercent ?? 0
          )
        );
        setStock(
          String(data.stock ?? "")
        );
        setIsActive(
          data.isActive ?? true
        );
      } catch (error: any) {
        console.error(
          "Fetch variant error:",
          error
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to load variant"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVariant();
    }
  }, [id]);


  // =========================================================
  // NEW IMAGE SELECT
  // =========================================================

 const handleImages = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if(files.length === 0) return;

    setImages((prev)=>{
      const remainingSlots= 5- prev.length;

      if (remainingSlots <= 0) {
      toast.error("You can upload maximum 5 images");
      return prev;
    }
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      toast.error("You can upload maximum 5 images");
    }

    return [...prev, ...filesToAdd]
    });

    setPreviewImages((prev)=>{
      const remainingSlots= 5- prev.length;

      const filesToAdd= files.slice(0,remainingSlots);

      const newPreviews = filesToAdd.map((file) =>
      URL.createObjectURL(file)
    );
    return[...prev, ...newPreviews]
    });

    //allow select file again
    e.target.value= ""
  };


  const removeNewImage = (
    index: number
  ) => {
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

  //remove image function
  const removeExistingImage= (index : number)=> {
    setExistingImages((prev)=>
    prev.filter((_,i)=> i !== index))
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

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

      const formData =
        new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "sku",
        sku.trim().toUpperCase()
      );

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      )

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

      await axios.put(
        `${API_URL}/api/variant/admin/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      toast.success(
        "Variant updated successfully"
      );

      navigate(
        "/variants"
      );
    } catch (error: any) {
      console.error(
        "Update variant error:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to update variant"
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading variant...
        </p>
      </div>
    );
  }


  if (!variant) {
    return (
      <div className="space-y-4">
        <button
          onClick={() =>
            navigate(
              "/variants"
            )
          }
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <ArrowLeft size={17} />
          Back to Variants
        </button>

        <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
          Variant not found.
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">

        <button
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
            Edit Variant
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Product:{" "}
            {variant.product?.name ||
              "-"}
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

          <input
            type="text"
            value={
              variant.product?.name ||
              ""
            }
            disabled
            className="h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-3 text-sm text-gray-500"
          />

        </div>


        {/* NAME / SKU */}
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
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-500"
            />

          </div>

        </div>


        {/* CURRENT IMAGES */}
        {existingImages.length > 0 && (
          <div>

            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Current Variant Images
            </h3>

            <div className="flex flex-wrap gap-3">

              {existingImages.map(
                (image, index) => (
                  <div
                  key={`${image}-${index}`}
                  className="relative">

                    <img
                    src={image}
                    alt={`${variant.name} ${
                      index + 1
                    }`}
                    className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                  <button type="button"
                  onClick={()=> removeExistingImage(index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-red-600"
                  aria-label="Remove image"
                  >
                    <X size={13}/>
                  </button>

                  </div>
                  
                )
              )}

            </div>

          </div>
        )}


        {/* REPLACE IMAGES */}
        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Replace Variant Images
          </label>

          <p className="mb-3 text-xs text-gray-500">
            Uploading new images will replace the
            current variant images. Maximum 5 images.
          </p>

          <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-4 hover:bg-gray-50">

            <Upload
              size={26}
              className="text-gray-400"
            />

            <span className="mt-2 text-sm text-gray-600">
              Click to select new images
            </span>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImages}
            />

          </label>


          {/* NEW PREVIEW */}
          {previewImages.length > 0 && (
            <div className="mt-4">

              <p className="mb-3 text-xs font-medium text-gray-600">
                New Images
              </p>

              <div className="flex flex-wrap gap-3">

                {previewImages.map(
                  (image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative"
                    >

                      <img
                        src={image}
                        alt={`New ${index + 1}`}
                        className="h-24 w-24 rounded-lg border object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(
                            index
                          )
                        }
                        className="absolute -right-2 -top-2 rounded-full bg-black p-1 text-white"
                      >
                        <X size={13} />
                      </button>

                    </div>
                  )
                )}

              </div>

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
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditVariant;