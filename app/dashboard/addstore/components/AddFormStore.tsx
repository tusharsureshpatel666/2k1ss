"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Heading from "../../components/heading";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParticStore, useStoreStep } from "@/store/store";
import StepIntro from "./form-steps/StepIntro";
import StepTitle from "./form-steps/StepTitle";
import FormNavigation from "./form-steps/Navitgate";
import StepTypeStore from "./form-steps/StepTypeStore";
import LocationPicker from "./form-steps/stepMap";
import { isValidDelhiPin } from "@/type/pinvalidation";
import StepImage from "./form-steps/StepImage";
import StepPartic from "./form-steps/StepPartic";
import StoreMethodtype from "./form-steps/StoreMethodtype";
import PriceInput from "./form-steps/stepprice";
import StepDesc from "./form-steps/StepDesc";
import PeopleDesc from "./form-steps/PeopleDesc";
import toast from "react-hot-toast";

const AddFormStore = () => {
  const router = useRouter();
  const { sStep, setSStep, nextSStep, prevStep, resetStep } = useStoreStep();
  const { share } = useParticStore();

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [storeType, setStoreType] = useState("");
  const [country, setCountry] = useState("");
  const [state, Sstate] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [fullAdd, setFullAdd] = useState("");
  const [desc, setDesc] = useState("");
  const [peopleDesc, setPeopleDesc] = useState("");
  const [bussinessType, setBussinessType] = useState("");
  const [price, setPrice] = useState("2000");

  // images
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    resetStep();
  }, [resetStep]);

  /* ---------------- STEP VALIDATION ---------------- */

  const isStepValid =
    (sStep === 1 && title.trim() !== "") ||
    (sStep === 2 && storeType.trim() !== "") ||
    (sStep === 3 &&
      country === "India" &&
      state === "Delhi" &&
      city.trim() !== "" &&
      isValidDelhiPin(pin) &&
      fullAdd.trim().length > 10) ||
    (sStep === 4 &&
      bannerImage !== null &&
      otherImages.filter(Boolean).length === 4) ||
    (sStep === 5 && share.mode !== "") ||
    (sStep === 6 &&
      ((share.mode === "HOURS_BY_HOURS" && share.startTime && share.endTime) ||
        (share.mode === "DAYS_BY_DAYS" &&
          Array.isArray(share.days) &&
          share.days.length > 0) ||
        (share.mode === "SPLIT_STORE" && share.sqft > 0) ||
        (share.mode === "DAY_OR_NIGHT" &&
          (share.dayOrNight === "Day" || share.dayOrNight === "Night")) ||
        share.mode === "Weekend" ||
        share.mode === "Regular")) ||
    (sStep === 7 && Number(price) > 0) ||
    (sStep === 8 && bussinessType !== "") ||
    (sStep === 9 && desc !== "") ||
    (sStep === 10 && peopleDesc !== "") ||
    sStep > 11;

  const handleNext = () => {
    if (!isStepValid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    nextSStep();
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadMedia = async () => {
    if (!bannerImage) throw new Error("Banner missing");

    const images = otherImages.filter(Boolean) as File[];
    if (images.length !== 4) {
      throw new Error("Exactly 4 images required");
    }

    const formData = new FormData();
    formData.append("banner", bannerImage);

    images.forEach((img, index) => {
      formData.append(`image_${index}`, img);
    });

    const res = await axios.post("/api/upload/imagess", formData);
    return res.data as { bannerUrl: string; imageUrls: string[] };
  };

  /* ---------------- FINAL SUBMIT ---------------- */

  const handleFinish = async () => {
    try {
      setLoading(true);

      const toastId = toast.loading("Uploading images...");
      const { bannerUrl, imageUrls } = await uploadMedia();
      toast.dismiss(toastId);
      toast.success("Images uploaded");

      const payload = {
        title,
        storeSize: storeType,
        country,
        state,
        city,
        pin,
        fullAddress: fullAdd,
        desc,
        priceInr: Number(price),
        businessType: bussinessType,
        peopleDesc,
        bannerImageUrl: bannerUrl,
        images: imageUrls,
        share: {
          mode: share.mode,
          startTime: share.startTime ?? null,
          endTime: share.endTime ?? null,
          days: share.days ?? [],
          sqft: share.sqft ?? null,
          dayOrNight: share.dayOrNight ?? null,
        },
      };

      const res = await axios.post("/api/store/create", payload);

      toast.success("Store Created 🎉");
      router.push(`/dashboard/store/${res.data.store.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-6xl mx-auto gap-6 mt-4 items-center justify-center">
      {sStep === 0 && <StepIntro />}
      {sStep === 1 && <StepTitle title={title} setTitle={setTitle} />}
      {sStep === 2 && (
        <StepTypeStore value={storeType} onChange={setStoreType} />
      )}
      {sStep === 3 && (
        <LocationPicker
          country={country}
          setCountry={setCountry}
          state={state}
          Sstate={Sstate}
          city={city}
          setCity={setCity}
          pin={pin}
          setPin={setPin}
          fullAdd={fullAdd}
          setFullAdd={setFullAdd}
        />
      )}
      {sStep === 4 && (
        <StepImage
          bannerImage={bannerImage}
          otherImages={otherImages}
          setBannerImage={setBannerImage}
          setOtherImages={setOtherImages}
        />
      )}
      {sStep === 5 && <StepPartic />}
      {sStep === 6 && <StoreMethodtype />}
      {sStep === 7 && <PriceInput price={price} setPrice={setPrice} />}
      {sStep === 8 && (
        <input
          value={bussinessType}
          onChange={(e) => setBussinessType(e.target.value)}
          placeholder="Business type"
          className="text-4xl font-semibold text-center bg-transparent outline-none"
        />
      )}
      {sStep === 9 && <StepDesc description={desc} setDescription={setDesc} />}
      {sStep === 10 && (
        <PeopleDesc
          partnerDescription={peopleDesc}
          setPartnerDescription={setPeopleDesc}
        />
      )}
      {sStep === 11 && (
        <div className="text-center space-y-6">
          <Image src="/done.svg" width={200} height={200} alt="done" />
          <Heading title="All Set 🎉" description="Your store is ready!" />
        </div>
      )}

      <FormNavigation
        step={sStep}
        isValid={isStepValid}
        loading={loading}
        shake={shake}
        onPrev={prevStep}
        onNext={handleNext}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default AddFormStore;
