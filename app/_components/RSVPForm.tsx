"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { strings } from "../utils/strings";
import { submitRSVP } from "../actions/submitRSVP";
import { Cover } from "@/components/ui/ui/cover";
import { toast } from "react-toastify";

const RSVPForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accompany, setAccompany] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("yes");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: "Name is required!" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required!" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("accompany", accompany || "0");
    formData.append("attendance", attendance);

    setIsloading(true);
    const response = await submitRSVP(formData);
    console.log(response);

    if (response.success) {
      toast.success(strings.thankYouMessage);
      setName("");
      setEmail("");
      setAccompany(null);
      setAttendance("yes");
      setErrors({});
    } else {
      //check if email already submitted
      if (response.error) {
        if (response.error.code === "23505") {
          setErrors({
            email: "Email already exists",
          });
          toast.error("Someone already submited with this email");
        }
      } else {
        toast.error(response.message);
      }
    }
    setIsloading(false);
  };
  const openGoogleMaps = () => {
    const encodedLocation = encodeURIComponent(strings.eventLocation);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
    );
  };

  return (
    <div className="max-w-md bg-black/50 p-5 max-sm:px-5 mx-auto my-10 max-sm:flex max-sm:flex-col max-sm:justify-center max-sm:items-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        <Cover>{strings.title}</Cover>
      </h1>
      <p className="mb-6 text-[1rem] md:text-lg font-semibold text-center">
        {strings.description}
      </p>

      <div className="mb-6 max-sm:w-full">
        <Label>{strings.eventDateLabel}</Label>
        {/* <p>{new Date(strings.eventDate).toLocaleDateString()}</p> */}
        <Calendar
          mode="single"
          selected={new Date(strings.eventDate)}
          fromDate={new Date(strings.eventDate)}
          toDate={new Date(strings.eventDate)}
          defaultMonth={new Date(strings.eventDate)}
          ISOWeek
          className="rounded-md border flex flex-col items-center max-sm:w-full"
        />

        <div className="mt-4 max-sm:w-full">
          <Button
            className="w-full"
            type="button"
            variant={"outline"}
            onClick={openGoogleMaps}
          >
            <MapPin />
            {strings.viewOnMapButton}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-sm:w-full">
        <div>
          <Label htmlFor="name">{strings.nameLabel}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            min={5}
            maxLength={100}
          />
          {errors.name && (
            <span className="text-red-500 text-sm mt-1">{errors.name}</span>
          )}
        </div>
        <div>
          <Label htmlFor="email">{strings.emailLabel}</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            min={10}
            maxLength={100}
            type="email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1">{errors.email}</span>
          )}
        </div>
        <div>
          <Label htmlFor="accompany">{strings.accompanyLabel}</Label>
          <Input
            id="accompany"
            type="number"
            min="0"
            value={accompany || ""}
            onChange={(e) => setAccompany(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>{strings.rsvpLabel}</Label>
          <RadioGroup value={attendance} onValueChange={setAttendance}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className={`${attendance === "yes" ? "bg-white" : ""}`}
                value="yes"
                id="yes"
              />
              <Label htmlFor="yes">{strings.yesOption}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                className={`${attendance === "no" ? "bg-white" : ""}`}
                value="no"
                id="no"
              />
              <Label htmlFor="no">{strings.noOption}</Label>
            </div>
          </RadioGroup>
        </div>
        <Button
          className="w-full bg-white/90 text-black hover:bg-white/70 font-bold flex justify-center border border-white"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Submitting" : strings.submitButton}
        </Button>
      </form>
    </div>
  );
};

export default RSVPForm;
