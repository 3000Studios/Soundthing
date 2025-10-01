import PropTypes from "prop-types";
import { Wifi } from "lucide-react";
import { formatNum } from "../utils/formatters";

const NetworkTab = ({ networkData }) => (
  <div className="space-y-4">
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white mb-2 flex items-center">
        <Wifi className="mr-2" size={16} /> Network
      </h3>
      <div className="text-xs text-gray-200 space-y-2">
        <div>
          Wi‑Fi Strength (sim): {formatNum(networkData?.wifiStrength, 1)}%
        </div>
        <div>
          Bluetooth devices (sim): {networkData?.bluetoothDevices ?? "--"}
        </div>
        <div>
          Cellular Signal (sim): {formatNum(networkData?.cellularSignal, 0)}%
        </div>
      </div>
    </div>
  </div>
);

NetworkTab.propTypes = {
  networkData: PropTypes.shape({
    wifiStrength: PropTypes.number,
    bluetoothDevices: PropTypes.number,
    cellularSignal: PropTypes.number,
  }),
};

export default NetworkTab;
