/* eslint-disable no-nested-ternary */
import shallow from 'zustand/shallow';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import {
  SideBySideViewer,
  PictureInPictureViewer,
  VolumeViewer,
  AdditiveColormapExtension,
  LensExtension,
  // eslint-disable-next-line import/no-unresolved
} from '@labshare/viv';
import {
  useImageSettingsStore,
  useViewerStore,
  useChannelsStore,
  useLoader,
} from '../state';
import { useWindowSize, get3DExtension } from '../utils';
import { DEFAULT_OVERVIEW } from '../constants';
import { createLoader } from '../utils';
import { generatePlateText } from '../../../layers/generatePlateText';
import { generateText } from '../../../layers/generateText';
import { generatePolygons } from '../../../layers/generatePolygons';
import { generateHeatmap } from '../../../layers/generateHeatmap';
import {
  defaultPlateZoom,
  initialLayerZoom,
  zoomTextVisibilities,
  tooltipBackgroundColor,
} from '../../../layers/constants';
import { getPixelValues } from '../getPixelValues';

const Viewer = (props) => {
  const [useLinkedView, use3d, viewState] = useViewerStore(
    (store) => [store.useLinkedView, store.use3d, store.viewState],
    shallow
  );
  const [colors, contrastLimits, channelsVisible, selections] =
    useChannelsStore(
      (store) => [
        store.colors,
        store.contrastLimits,
        store.channelsVisible,
        store.selections,
      ],
      shallow
    );
  const loader = useLoader();
  const viewSize = useWindowSize();
  const [
    lensSelection,
    colormap,
    renderingMode,
    xSlice,
    ySlice,
    zSlice,
    resolution,
    lensEnabled,
    zoomLock,
    panLock,
    isOverviewOn,
    onViewportLoad,
    useFixedAxis,
  ] = useImageSettingsStore(
    (store) => [
      store.lensSelection,
      store.colormap,
      store.renderingMode,
      store.xSlice,
      store.ySlice,
      store.zSlice,
      store.resolution,
      store.lensEnabled,
      store.zoomLock,
      store.panLock,
      store.isOverviewOn,
      store.onViewportLoad,
      store.useFixedAxis,
    ],
    shallow
  );
  const onViewStateChange = (vws) => {
    const {
      viewState: { zoom },
    } = vws;
    const z = Math.min(Math.max(Math.round(-zoom), 0), loader.length - 1);
    useViewerStore.setState({ pyramidResolution: z });
    handleZoom(vws);
  };

  const [plateZoom, setPlateZoom] = useState(defaultPlateZoom);
  const [loaders, setLoaders] = useState([]);
  const [textLayers, setTextLayers] = useState([]);
  const [heatMapLayer, setHeatmapLayer] = useState([]);
  const [polygonLayer, setPolygonLayer] = useState([]);
  const [zoomState, setZoomState] = useState(initialLayerZoom);

  const regenerateTextLayers = (zoom) => {
    setTextLayers([
      generatePlateText(
        props.processedData.plateOverlayData,
        props.overlayVisibilities['All Overlays'] &&
          props.overlayVisibilities['Text'] &&
          zoom < defaultPlateZoom
      ),
      generateText(
        props.processedData.wellOverlayData,
        props.processedData.cellSize,
        props.overlayVisibilities['All Overlays'] &&
          props.overlayVisibilities['Text'] &&
          zoom > zoomTextVisibilities['well_location'] &&
          zoom < -3,
        'well_location'
      ),
    ]);
  };

  const regeneratePlateHeatmap = (zoom) => {
    setPolygonLayer([
      generatePolygons(
        props.processedData.plateOverlayData,
        props.overlayVisibilities['All Overlays'] &&
          props.overlayVisibilities['Plate Heatmap'] &&
          zoom < plateZoom,
        props.heatmapOpacity
      ),
    ]);
  };
  const regenerateWellHeatmap = (zoom) => {
    setHeatmapLayer([
      generateHeatmap(
        props.processedData.wellOverlayData,
        props.processedData.cellSize,
        props.overlayVisibilities['All Overlays'] &&
          props.overlayVisibilities['Well Heatmap'] &&
          zoom < -3 &&
          zoom >= plateZoom,
        1,
        props.heatmapOpacity,
        props.heatmapId
      ),
    ]);
  };

  useEffect(() => {
    Promise.all(props.urls.map((url) => createLoader(url))).then((values) =>
      setLoaders(values.map((value) => value.data))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.urls]);

  useEffect(() => {
    regeneratePlateHeatmap(zoomState);
    regenerateTextLayers(zoomState);
  }, [props.processedData.plateOverlayData]);

  useEffect(() => {
    regenerateWellHeatmap(zoomState);
  }, [props.heatmapId]);

  useEffect(() => {
    regenerateWellHeatmap(zoomState);
    regeneratePlateHeatmap(zoomState);
  }, [props.heatmapOpacity]);

  useEffect(() => {
    regenerateWellHeatmap(zoomState);
    regeneratePlateHeatmap(zoomState);
    regenerateTextLayers(zoomState);
  }, [props.overlayVisibilities['All Overlays']]);

  useEffect(() => {
    regenerateWellHeatmap(zoomState);
  }, [props.overlayVisibilities['Well Heatmap']]);

  useEffect(() => {
    regeneratePlateHeatmap(zoomState);
  }, [props.overlayVisibilities['Plate Heatmap']]);

  useEffect(() => {
    regenerateTextLayers(zoomState);
  }, [props.overlayVisibilities['Text']]);

  useEffect(() => {
    const updatedPlateZoom = props.overlayVisibilities[
      'Well Heatmap When Zoomed Out'
    ]
      ? -Infinity
      : defaultPlateZoom;
    setPlateZoom(updatedPlateZoom);
  }, [props.overlayVisibilities['Well Heatmap When Zoomed Out']]);

  useEffect(() => {
    regenerateWellHeatmap(zoomState);
    regeneratePlateHeatmap(zoomState);
  }, [plateZoom]);

  const handleZoom = (vws) => {
    setZoomState(vws.viewState.zoom);

    if (
      (vws.viewState.zoom >= -3 && vws.oldViewState.zoom < -3) ||
      (vws.viewState.zoom < -3 && vws.oldViewState.zoom >= -3)
    ) {
      regenerateWellHeatmap(vws.viewState.zoom);
      regenerateTextLayers(vws.viewState.zoom);
    }

    if (
      (vws.viewState.zoom < plateZoom && vws.oldViewState.zoom >= plateZoom) ||
      (vws.viewState.zoom >= plateZoom && vws.oldViewState.zoom < plateZoom)
    ) {
      regenerateWellHeatmap(vws.viewState.zoom);
      regeneratePlateHeatmap(vws.viewState.zoom);
    }
    if (
      (vws.viewState.zoom >= defaultPlateZoom &&
        vws.oldViewState.zoom < defaultPlateZoom) ||
      (vws.viewState.zoom < defaultPlateZoom &&
        vws.oldViewState.zoom >= defaultPlateZoom) ||
      (vws.viewState.zoom >= zoomTextVisibilities['well_location'] &&
        vws.oldViewState.zoom < zoomTextVisibilities['well_location']) ||
      (vws.viewState.zoom < zoomTextVisibilities['well_location'] &&
        vws.oldViewState.zoom >= zoomTextVisibilities['well_location'])
    ) {
      regenerateTextLayers(vws.viewState.zoom);
    }
  };

  const deckRef = React.useRef(null);
  return use3d ? (
    <VolumeViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      colormap={colormap}
      xSlice={xSlice}
      ySlice={ySlice}
      zSlice={zSlice}
      resolution={resolution}
      extensions={[get3DExtension(colormap, renderingMode)]}
      height={viewSize.height}
      width={viewSize.width}
      onViewportLoad={onViewportLoad}
      useFixedAxis={useFixedAxis}
      viewStates={[viewState]}
      onViewStateChange={debounce(
        ({ viewState: newViewState, viewId }) =>
          useViewerStore.setState({
            viewState: { ...newViewState, id: viewId },
          }),
        250,
        { trailing: true }
      )}
    />
  ) : useLinkedView ? (
    <SideBySideViewer
      loader={loader}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      zoomLock={zoomLock}
      panLock={panLock}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[
        colormap ? new AdditiveColormapExtension() : new LensExtension(),
      ]}
      colormap={colormap || 'viridis'}
    />
  ) : loaders.length > 0 ? (
    <PictureInPictureViewer
      gridLoaders={{
        loaders,
        spacingX: 100000,
        spacingY: 100000,
        numberOfColumns: 20,
      }}
      deckProps={{
        layers: [...polygonLayer, ...heatMapLayer, ...textLayers],
        ref: deckRef,
        getTooltip: (arg) => {
          const pickInfos = deckRef.current.pickMultipleObjects({
            x: arg.x,
            y: arg.y,
            depth: 2,
          });
          useViewerStore.setState({
            pixelValues: getPixelValues(pickInfos?.[1]),
          });
          const object = arg.object;
          return (
            props.overlayVisibilities['Tooltip'] &&
            object && {
              html:
                zoomState >= plateZoom
                  ? `${
                      object.drugUrl === undefined
                        ? ''
                        : `<img width='300' height='300' crossOrigin="anonymous"
          referrerPolicy="origin"
          src="${object.drugUrl}">`
                    }
          <div style="width:300px">${object.drug_name}</div>
          <div style="width:300px">${object.viral_data}</div>
          ${Object.keys(zoomTextVisibilities)
            .map((fieldName) =>
              zoomState <= zoomTextVisibilities[fieldName]
                ? '<div style="width:300px">' + object[fieldName] + '</div>'
                : ''
            )
            .join('')}`
                  : 'Plate ' + object.plateText,
              style: {
                backgroundColor: tooltipBackgroundColor,
                fontSize: '0.8em',
              },
            }
          );
        },
      }}
      contrastLimits={contrastLimits}
      colors={colors}
      channelsVisible={channelsVisible}
      selections={selections}
      height={viewSize.height}
      width={viewSize.width}
      overview={DEFAULT_OVERVIEW}
      overviewOn={isOverviewOn}
      hoverHooks={{
        handleValue: (v) => useViewerStore.setState({ pixelValues: v }),
      }}
      lensSelection={lensSelection}
      lensEnabled={lensEnabled}
      onViewportLoad={onViewportLoad}
      extensions={[
        colormap ? new AdditiveColormapExtension() : new LensExtension(),
      ]}
      colormap={colormap || 'viridis'}
      onViewStateChange={onViewStateChange}
    />
  ) : (
    <></>
  );
};
export default Viewer;
