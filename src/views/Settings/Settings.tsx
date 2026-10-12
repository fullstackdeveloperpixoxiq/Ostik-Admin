import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import {
  Truck,
  Images,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================

interface ShippingSettingsData {
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number | string;
  standardShippingFee: number | string;
}

interface CarouselMessage {
  _id?: string;
  text: string;
  isActive: boolean;
}

interface CarouselSettingsData {
  isVisible: boolean;
  messages: CarouselMessage[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  settings?: T;
  carousel?: T;
}

interface StatusMessageData {
  type: "success" | "error";
  text: string;
}

// ==========================================
// CONSTANTS
// ==========================================

const API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_SHIPPING: ShippingSettingsData = {
  freeDeliveryEnabled: true,
  freeDeliveryThreshold: 100000,
  standardShippingFee: 40,
};

const DEFAULT_CAROUSEL: CarouselSettingsData = {
  isVisible: true,
  messages: [],
};

const inputClass =
  "mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

const saveButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60";

// ==========================================
// COMPONENT
// ==========================================

const Settings = () => {
  const [shipping, setShipping] =
    useState<ShippingSettingsData>(DEFAULT_SHIPPING);

  const [carousel, setCarousel] =
    useState<CarouselSettingsData>(DEFAULT_CAROUSEL);

  const [loading, setLoading] = useState(true);
  const [savingShipping, setSavingShipping] = useState(false);
  const [savingCarousel, setSavingCarousel] = useState(false);

  const [shippingMessage, setShippingMessage] =
    useState<StatusMessageData | null>(null);

  const [carouselMessage, setCarouselMessage] =
    useState<StatusMessageData | null>(null);

  const shippingAPI = `${API_URL}/api/settings/shipping`;
  const carouselAPI = `${API_URL}/api/settings/promo-carousel`;

  // ==========================================
  // FETCH SETTINGS
  // ==========================================

  const fetchSettings = async (): Promise<void> => {
    setLoading(true);
    setShippingMessage(null);
    setCarouselMessage(null);

    try {
      const [shippingResponse, carouselResponse] =
        await Promise.all([
          axios.get<ApiResponse<ShippingSettingsData>>(
            shippingAPI
          ),
          axios.get<ApiResponse<CarouselSettingsData>>(
            carouselAPI
          ),
        ]);

      // SHIPPING SETTINGS
      if (
        shippingResponse.data.success &&
        shippingResponse.data.settings
      ) {
        const settings = shippingResponse.data.settings;

        setShipping({
          freeDeliveryEnabled:
            settings.freeDeliveryEnabled ?? true,
          freeDeliveryThreshold:
            settings.freeDeliveryThreshold ?? 100000,
          standardShippingFee:
            settings.standardShippingFee ?? 40,
        });
      }

      // PROMO CAROUSEL SETTINGS
      if (
        carouselResponse.data.success &&
        carouselResponse.data.carousel
      ) {
        const settings = carouselResponse.data.carousel;

        setCarousel({
          isVisible: settings.isVisible ?? true,
          messages: Array.isArray(settings.messages)
            ? settings.messages.map((message) => ({
                _id: message._id,
                text: message.text ?? "",
                isActive: message.isActive ?? true,
              }))
            : [],
        });
      }
    } catch (error: unknown) {
      console.error("Fetch settings error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      setShippingMessage({
        type: "error",
        text: message || "Unable to load settings. Please check the API connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSettings();
  }, []);

  // ==========================================
  // SHIPPING SETTINGS
  // ==========================================

  const handleShippingChange = (
    field: keyof ShippingSettingsData,
    value: boolean | string | number
  ): void => {
    setShipping((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveShippingSettings = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setShippingMessage(null);

    const threshold = Number(shipping.freeDeliveryThreshold);
    const fee = Number(shipping.standardShippingFee);

    if (
      shipping.freeDeliveryThreshold === "" ||
      shipping.standardShippingFee === "" ||
      !Number.isFinite(threshold) ||
      !Number.isFinite(fee) ||
      threshold < 0 ||
      fee < 0
    ) {
      setShippingMessage({
        type: "error",
        text: "Please enter valid, non-negative amounts.",
      });
      return;
    }

    setSavingShipping(true);

    try {
      const response = await axios.put<
        ApiResponse<ShippingSettingsData>
      >(shippingAPI, {
        freeDeliveryEnabled: shipping.freeDeliveryEnabled,
        freeDeliveryThreshold: threshold,
        standardShippingFee: fee,
      });

      if (!response.data.success || !response.data.settings) {
        throw new Error(
          response.data.message ||
            "Shipping settings could not be saved."
        );
      }

      const saved = response.data.settings;

      setShipping({
        freeDeliveryEnabled: saved.freeDeliveryEnabled,
        freeDeliveryThreshold: saved.freeDeliveryThreshold,
        standardShippingFee: saved.standardShippingFee,
      });

      setShippingMessage({
        type: "success",
        text: "Shipping settings saved successfully.",
      });
    } catch (error: unknown) {
      console.error("Save shipping settings error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      setShippingMessage({
        type: "error",
        text: message || "Failed to save shipping settings.",
      });
    } finally {
      setSavingShipping(false);
    }
  };

  // ==========================================
  // CAROUSEL MESSAGE FUNCTIONS
  // ==========================================

  const updateCarouselMessage = (
    index: number,
    field: "text" | "isActive",
    value: string | boolean
  ): void => {
    setCarousel((previous) => ({
      ...previous,
      messages: previous.messages.map((message, i) =>
        i === index
          ? { ...message, [field]: value }
          : message
      ),
    }));
  };

  const addCarouselMessage = (): void => {
    setCarousel((previous) => ({
      ...previous,
      messages: [
        ...previous.messages,
        {
          text: "",
          isActive: true,
        },
      ],
    }));
  };

  const removeCarouselMessage = (index: number): void => {
    setCarousel((previous) => ({
      ...previous,
      messages: previous.messages.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // SAVE CAROUSEL SETTINGS
  // ==========================================

  const saveCarouselSettings = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setCarouselMessage(null);

    const messages = carousel.messages.map((message) => ({
      ...(message._id ? { _id: message._id } : {}),
      text: message.text.trim(),
      isActive: message.isActive,
    }));

    if (messages.some((message) => !message.text)) {
      setCarouselMessage({
        type: "error",
        text: "Please fill in every message or remove empty messages.",
      });
      return;
    }

    setSavingCarousel(true);

    try {
      const response = await axios.put<
        ApiResponse<CarouselSettingsData>
      >(carouselAPI, {
        isVisible: carousel.isVisible,
        messages,
      });

      if (!response.data.success || !response.data.carousel) {
        throw new Error(
          response.data.message ||
            "Carousel settings could not be saved."
        );
      }

      const saved = response.data.carousel;

      setCarousel({
        isVisible: saved.isVisible,
        messages: Array.isArray(saved.messages)
          ? saved.messages.map((message) => ({
              _id: message._id,
              text: message.text ?? "",
              isActive: message.isActive ?? true,
            }))
          : [],
      });

      setCarouselMessage({
        type: "success",
        text: "Promo carousel settings saved successfully.",
      });
    } catch (error: unknown) {
      console.error("Save carousel settings error:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;

      setCarouselMessage({
        type: "error",
        text: message || "Failed to save carousel settings.",
      });
    } finally {
      setSavingCarousel(false);
    }
  };

  // ==========================================
  // STATUS MESSAGE
  // ==========================================

  const StatusMessage = ({
    message,
  }: {
    message: StatusMessageData | null;
  }) => {
    if (!message) return null;

    const success = message.type === "success";

    return (
      <div
        role="status"
        className={`mb-4 flex items-start gap-2 rounded-lg border p-3 text-sm ${
          success
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {success ? (
          <CheckCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
        ) : (
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
        )}

        <span>{message.text}</span>
      </div>
    );
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center gap-3 text-gray-600">
        <RefreshCw size={20} className="animate-spin" />
        Loading settings...
      </div>
    );
  }

  // ==========================================
  // SETTINGS PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <SettingsIcon size={16} />
              Admin / Settings
            </div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Store Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage delivery charges and promotional messages.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchSettings()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:self-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="space-y-7">

          {/* ======================================
              SHIPPING SETTINGS
          ====================================== */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5 sm:px-7">
              <div className="rounded-lg bg-green-50 p-3 text-green-700">
                <Truck size={23} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Shipping Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure delivery charges for customer orders.
                </p>
              </div>
            </div>

            <form
              onSubmit={saveShippingSettings}
              className="space-y-6 p-5 sm:p-7"
            >
              <StatusMessage message={shippingMessage} />

              {/* FREE DELIVERY TOGGLE */}

              <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    Enable Free Delivery
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Waive delivery charges when the order meets
                    the threshold.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={shipping.freeDeliveryEnabled}
                  aria-label="Enable free delivery"
                  onClick={() =>
                    handleShippingChange(
                      "freeDeliveryEnabled",
                      !shipping.freeDeliveryEnabled
                    )
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    shipping.freeDeliveryEnabled
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      shipping.freeDeliveryEnabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* FREE DELIVERY THRESHOLD */}

                <div>
                  <label
                    htmlFor="freeDeliveryThreshold"
                    className="text-sm font-medium text-gray-700"
                  >
                    Free Delivery Threshold (₹)
                  </label>

                  <input
                    id="freeDeliveryThreshold"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    disabled={!shipping.freeDeliveryEnabled}
                    value={shipping.freeDeliveryThreshold}
                    onChange={(event) =>
                      handleShippingChange(
                        "freeDeliveryThreshold",
                        event.target.value
                      )
                    }
                    className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100`}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Orders at or above this amount qualify for
                    free delivery.
                  </p>
                </div>

                {/* STANDARD DELIVERY CHARGE */}

                <div>
                  <label
                    htmlFor="standardShippingFee"
                    className="text-sm font-medium text-gray-700"
                  >
                    Standard Delivery Charge (₹)
                  </label>

                  <input
                    id="standardShippingFee"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={shipping.standardShippingFee}
                    onChange={(event) =>
                      handleShippingChange(
                        "standardShippingFee",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Charged when the order does not qualify for
                    free delivery.
                  </p>
                </div>
              </div>

              {/* SHIPPING SUMMARY */}

              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-800">
                  Current configuration
                </p>

                <p className="mt-2">
                  Standard charge: ₹
                  {Number(
                    shipping.standardShippingFee || 0
                  ).toLocaleString("en-IN")}
                </p>

                <p className="mt-1">
                  Free delivery:{" "}
                  {shipping.freeDeliveryEnabled
                    ? `On orders of ₹${Number(
                        shipping.freeDeliveryThreshold || 0
                      ).toLocaleString("en-IN")} or more`
                    : "Disabled"}
                </p>
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  disabled={savingShipping}
                  className={saveButtonClass}
                >
                  <Save size={17} />

                  {savingShipping
                    ? "Saving..."
                    : "Save Shipping Settings"}
                </button>
              </div>
            </form>
          </section>

          {/* ======================================
              PROMO CAROUSEL SETTINGS
          ====================================== */}

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5 sm:px-7">
              <div className="rounded-lg bg-green-50 p-3 text-green-700">
                <Images size={23} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Promo Carousel
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the promotional messages shown on your store.
                </p>
              </div>
            </div>

            <form
              onSubmit={saveCarouselSettings}
              className="space-y-6 p-5 sm:p-7"
            >
              <StatusMessage message={carouselMessage} />

              {/* CAROUSEL VISIBILITY */}

              <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="font-medium text-gray-900">
                    Show Promo Carousel
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Turn the promotional message bar on or off.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={carousel.isVisible}
                  aria-label="Show promo carousel"
                  onClick={() =>
                    setCarousel((previous) => ({
                      ...previous,
                      isVisible: !previous.isVisible,
                    }))
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    carousel.isVisible
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      carousel.isVisible
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* CAROUSEL MESSAGES */}

              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Carousel Messages
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Add, edit, activate or remove promotional messages.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addCarouselMessage}
                    className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                  >
                    <Plus size={17} />
                    Add Message
                  </button>
                </div>

                {carousel.messages.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center">
                    <Images
                      size={28}
                      className="mx-auto mb-2 text-gray-400"
                    />

                    <p className="text-sm text-gray-600">
                      No carousel messages added yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Select Add Message to create one.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {carousel.messages.map((message, index) => (
                      <div
                        key={message._id || index}
                        className="rounded-lg border border-gray-200 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Message {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeCarouselMessage(index)
                            }
                            aria-label={`Remove message ${index + 1}`}
                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          aria-label={`Carousel message ${index + 1}`}
                          value={message.text}
                          onChange={(event) =>
                            updateCarouselMessage(
                              index,
                              "text",
                              event.target.value
                            )
                          }
                          placeholder="Enter promotional message..."
                          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />

                        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={message.isActive}
                            onChange={(event) =>
                              updateCarouselMessage(
                                index,
                                "isActive",
                                event.target.checked
                              )
                            }
                            className="h-4 w-4 accent-green-600"
                          />

                          Show this message on the website
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  disabled={savingCarousel}
                  className={saveButtonClass}
                >
                  <Save size={17} />

                  {savingCarousel
                    ? "Saving..."
                    : "Save Carousel Settings"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ostik Admin · Store configuration
        </p>
      </div>
    </div>
  );
};

export default Settings;