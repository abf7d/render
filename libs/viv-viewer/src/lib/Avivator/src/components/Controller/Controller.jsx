import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import shallow from 'zustand/shallow';

import ChannelController from './components/ChannelController.jsx';
import Menu from './components/Menu.jsx';
import ColormapSelect from './components/ColormapSelect.jsx';
import GlobalSelectionSlider from './components/GlobalSelectionSlider.jsx';
import LensSelect from './components/LensSelect.jsx';
import VolumeButton from './components/VolumeButton.jsx';
import RenderingModeSelect from './components/RenderingModeSelect.jsx';
import Slicer from './components/Slicer.jsx';
import AddChannel from './components/AddChannel.jsx';
import PanLockToggle from './components/PanLockToggle.jsx';
import ZoomLockToggle from './components/ZoomLockToggle.jsx';
import SideBySideToggle from './components/SideBySideToggle.jsx';
import PictureInPictureToggle from './components/PictureInPictureToggle.jsx';
import CameraOptions from './components/CameraOptions.jsx';
import {
  useChannelsStore,
  useViewerStore,
  useImageSettingsStore,
  useLoader,
  useMetadata,
} from '../../state';
import { guessRgb, useWindowSize, getSingleSelectionStats } from '../../utils';
import { GLOBAL_SLIDER_DIMENSION_FIELDS } from '../../constants';

import { store } from '../../../../../../../state/state';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const Controller = () => {
  const [
    channelsVisible,
    contrastLimits,
    colors,
    domains,
    selections,
    ids,
    setPropertiesForChannel,
    toggleIsOnSetter,
    removeChannel,
  ] = useChannelsStore(
    (store) => [
      store.channelsVisible,
      store.contrastLimits,
      store.colors,
      store.domains,
      store.selections,
      store.ids,
      store.setPropertiesForChannel,
      store.toggleIsOn,
      store.removeChannel,
    ],
    shallow
  );
  const loader = useLoader();

  const colormap = useImageSettingsStore((store) => store.colormap);
  const [
    channelOptions,
    useLinkedView,
    use3d,
    useColormap,
    useLens,
    isChannelLoading,
    setIsChannelLoading,
    removeIsChannelLoading,
    pixelValues,
    isViewerLoading,
  ] = useViewerStore(
    (store) => [
      store.channelOptions,
      store.useLinkedView,
      store.use3d,
      store.useColormap,
      store.useLens,
      store.isChannelLoading,
      store.setIsChannelLoading,
      store.removeIsChannelLoading,
      store.pixelValues,
      store.isViewerLoading,
    ],
    shallow
  );
  const metadata = useMetadata();
  const viewSize = useWindowSize();
  const isRgb = metadata && guessRgb(metadata);
  const { shape, labels } = loader[0];
  const globalControlLabels = labels.filter((label) =>
    GLOBAL_SLIDER_DIMENSION_FIELDS.includes(label)
  );
  const onSelectionChanges = []; // For exposing functionality externally
  const channelControllers = ids.map((id, i) => {
    const onSelectionChange = (e) => {
      const selection = {
        ...selections[i],
        c: channelOptions.indexOf(e.target.value),
      };
      setIsChannelLoading(i, true);
      getSingleSelectionStats({
        loader,
        selection,
        use3d,
      }).then(({ domain, contrastLimits: newContrastLimit }) => {
        setPropertiesForChannel(i, {
          contrastLimits: newContrastLimit,
          domains: domain,
        });
        useImageSettingsStore.setState({
          onViewportLoad: () => {
            useImageSettingsStore.setState({ onViewportLoad: () => {} });
            setIsChannelLoading(i, false);
          },
        });
        setPropertiesForChannel(i, { selections: selection });
      });
    };
    onSelectionChanges.push(onSelectionChange); // For exposing functionality externally
    const toggleIsOn = () => toggleIsOnSetter(i);
    const handleSliderChange = (e, v) =>
      setPropertiesForChannel(i, { contrastLimits: v });
    const handleRemoveChannel = () => {
      removeChannel(i);
      removeIsChannelLoading(i);
    };
    const handleColorSelect = (color) => {
      setPropertiesForChannel(i, { colors: color });
    };
    const name = channelOptions[selections[i].c];
    return (
      <Grid
        key={`channel-controller-${name}-${id}`}
        style={{ width: '100%' }}
        item
      >
        <ChannelController
          name={name}
          onSelectionChange={onSelectionChange}
          channelsVisible={channelsVisible[i]}
          pixelValue={pixelValues[i]}
          toggleIsOn={toggleIsOn}
          handleSliderChange={handleSliderChange}
          domain={domains[i]}
          slider={contrastLimits[i]}
          color={colors[i]}
          handleRemoveChannel={handleRemoveChannel}
          handleColorSelect={handleColorSelect}
          isLoading={isChannelLoading[i]}
        />
      </Grid>
    );
  });
  store.setState({ onSelectionChanges }); // For exposing functionality externally
  const globalControllers = globalControlLabels.map((label) => {
    const size = shape[labels.indexOf(label)];
    // Only return a slider if there is a "stack."
    return size > 1 ? (
      <GlobalSelectionSlider key={label} size={size} label={label} />
    ) : null;
  });
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };
  return (
    <Menu maxHeight={viewSize.height}>
      <TabPanel value={tab} index={0}>
        {useColormap && <ColormapSelect />}
        {useLens && !colormap && !use3d && shape[labels.indexOf('c')] > 1 && (
          <LensSelect
            channelOptions={selections.map((sel) => channelOptions[sel.c])}
          />
        )}
        {!use3d && globalControllers}
        {!isViewerLoading && !isRgb ? (
          <Grid container>{channelControllers}</Grid>
        ) : (
          <Grid container justify="center">
            {!isRgb && <CircularProgress />}
          </Grid>
        )}
        {!isRgb && <AddChannel />}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {<RenderingModeSelect />}
        {<Slicer />}
        {<CameraOptions />}
      </TabPanel>
      <Divider
        style={{
          marginTop: '8px',
          marginBottom: '8px',
        }}
      />
      {<PictureInPictureToggle />}
      {<SideBySideToggle />}
      {useLinkedView && !use3d && (
        <>
          <ZoomLockToggle />
          <PanLockToggle />
        </>
      )}
    </Menu>
  );
};
export default Controller;
