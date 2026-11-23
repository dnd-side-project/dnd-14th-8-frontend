import type { Meta, StoryObj } from "@storybook/react";
import {
  FacilityPinDefault,
  FacilityPinDot,
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

/** 흰 테두리가 보이도록 지도처럼 옅은 회색 위에 그린다. 분류와 상관없이 같은 모양이다. */
export const Dot: StoryObj = {
  render: () => (
    <div className="flex bg-fill-neutral-subtler p-8">
      <FacilityPinDot />
    </div>
  ),
};

/** 결과 화면의 주변 살펴보기 탭에서 처음 화면보다 축소하면 왼쪽 핀이 오른쪽 점으로 바뀐다(#277). */
export const DotComparedWithDefault: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4 bg-fill-neutral-subtler p-8">
      <FacilityPinDefault type="cafe" />
      <FacilityPinDot />
    </div>
  ),
};
