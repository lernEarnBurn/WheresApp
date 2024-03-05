import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Loader2 } from "lucide-react";

import PropTypes from "prop-types";

ImageSenderInterface.propTypes = {
  loading: PropTypes.bool.isRequired,
  picUrl: PropTypes.string.isRequired,
  setPicToSendSelected: PropTypes.func.isRequired,
  sendMessageImage: PropTypes.func.isRequired,
};

export function ImageSenderInterface({
  loading,
  picUrl,
  setPicToSendSelected,
  sendMessageImage,
}) {
  return (
    <CardContainer>
      <CardBody className="bg-gray-50 relative w-auto   border-black/[0.1]  sm:w-[30rem] h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600"
        >
          Send Image
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={picUrl}
            className="z-10 h-[27.7rem] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mt-24">
          <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-3 rounded-xl text-xs font-normal"
            onClick={() => {
              setPicToSendSelected(false);
            }}
          >
            Close
          </CardItem>
          {!loading ? (
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-3 rounded-xl bg-black text-white text-xs font-bold"
              onClick={sendMessageImage}
            >
              Send
            </CardItem>
          ) : (
            <CardItem
              translateZ={20}
              as="button"
              disabled
              className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold"
              onClick={sendMessageImage}
            >
              <Loader2 className="animate-spin" />
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
}
