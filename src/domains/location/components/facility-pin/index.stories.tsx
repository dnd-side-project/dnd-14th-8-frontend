import type { Meta, StoryObj } from "@storybook/react";
import {
  FacilityPinDefault,
  FacilityPinSelected,
} from "@/domains/location/components/facility-pin";

const meta: Meta = {
  title: "domains/location/FacilityPin",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="flex gap-8 p-8">
      <FacilityPinDefault type="book" />
      <FacilityPinDefault type="meetingroom" />
      <FacilityPinDefault type="restaurant" />
      <FacilityPinDefault type="cafe" />
    </div>
  ),
};

export const Selected: StoryObj = {
  render: () => (
    <div className="flex gap-8 p-8">
      <FacilityPinSelected type="book" />
      <FacilityPinSelected type="meetingroom" />
      <FacilityPinSelected type="restaurant" />
      <FacilityPinSelected type="cafe" />
    </div>
  ),
};
