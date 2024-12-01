 
import React from 'react';
import Image from 'next/image';
import { IconButton } from '@mui/material';

import CloseIcon from "@mui/icons-material/Close";

type Props = {
  
    itemDetail: any;
    setDetailWindow: React.Dispatch<React.SetStateAction<boolean>>;

};

const ItemDetail =(props: Props) => {

    const { itemDetail, setDetailWindow } = props;

    return (
        <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setDetailWindow(false)}
        ></div>
        <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-4/5 h-3/4 bg-white  z-10 rounded-lg">
          <div className="flex flex-row items-center justify-end gap-4">
            <IconButton
              onClick={() => setDetailWindow(false)}
              className="absolute top-0 right-0"
            >
              <CloseIcon className="text-dark " />
            </IconButton>
          </div>

          <div className="flex flex-col px-3">
            <div className="text-lg text-dark font-bold">
              {itemDetail?.name}
            </div>
            {itemDetail?.img_url ? (
              <Image
                src={itemDetail?.img_url}
                alt={itemDetail?.name}
                width={200}
                height={200}
              />
            ) : null}
            <div className=" text-dark">{itemDetail?.item_category}</div>
            <div className=" text-dark ">{itemDetail?.item_location}</div>
          </div>
        </div>
      </>
    );


};

export default ItemDetail;