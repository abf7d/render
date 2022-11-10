import React, { useEffect } from 'react';

import { useViewerStore } from './state';
import { useImage } from './hooks';
import SnackBars from './components/Snackbars/Snackbars.jsx';
import Viewer from './components/Viewer.jsx';
import Controller from './components/Controller/Controller.jsx';
import DropzoneWrapper from './components/DropzoneWrapper.jsx';
import Footer from './components/Footer.jsx';
import {store} from '../../../../../state/state';

/* eslint-disable camelcase */
import create from 'zustand';

//import './index.css';

/**
 * This component serves as batteries-included visualization for OME-compliant tiff or zarr images.
 * This includes color contrastLimits, selectors, and more.
 * @param {Object} props
 * @param {Object} props.history A React router history object to create new urls (optional).
 * @param {Object} args.sources A list of sources for a dropdown menu, like [{ url, description }]
 * */
export default function Avivator(props) {
  const { history, source: initSource, isDemoImage } = props;
  const isViewerLoading = useViewerStore(store => store.isViewerLoading);
  const source = useViewerStore(store => store.source);
  const useLinkedView = useViewerStore(store => store.useLinkedView);
  const useBoundStore = create(store);
  const heatmapId=useBoundStore((state) => state.heatmapId);
  const urls=useBoundStore((state) => state.urls);
  const processedData=useBoundStore((state) => state.processedData);
  const heatmapOpacity=useBoundStore((state) => state.heatmapOpacity);
  const overlayVisibilities=useBoundStore((state) => state.overlayVisibilities)

  useEffect(() => {
    if (urls[0] !== undefined) {
      useViewerStore.setState({
        source: {
          "urlOrFile": urls[0],
          "description": ""
      },
        isNoImageUrlSnackbarOn: isDemoImage
      });
    }
  }, [urls]); // eslint-disable-line react-hooks/exhaustive-deps
  useImage(source, history);
  return (
    <>
      {!isViewerLoading && <Viewer urls={urls} processedData={processedData} heatmapId={heatmapId} heatmapOpacity={heatmapOpacity} overlayVisibilities={overlayVisibilities}/>}
      <Controller />
    </>
  );
}
