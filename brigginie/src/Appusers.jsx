import { Routes, Route } from 'react-router-dom';

// User Pages
import Frontpage from './components/userspages/interactive/Frontpage';
import Pcstores from './components/userspages/interactive/pcstores';
import Aibuild from './components/userspages/interactive/aibuild';
import Components from './components/userspages/interactive/components';
import Laptops from './components/userspages/interactive/laptops';
import Account from './components/userspages/interactive/account';
import Servers from './components/userspages/interactive/servers';
import Map from './components/userspages/interactive/map';
import Help from './components/userspages/interactive/help';
import Blog from './components/userspages/interactive/blog';
import Survey from './components/userspages/interactive/survey';
import Cart from './components/userspages/interactive/cart';
import UserProfile from './components/userspages/interactive/userprofile';

// CPU
import Intel from './components/userspages/products/cpu/intel';
import AMD from './components/userspages/products/cpu/amd';

// Motherboard
import ASUS from './components/userspages/products/motherboard/asus';
import MSI from './components/userspages/products/motherboard/msi';
import Gigabyte from './components/userspages/products/motherboard/gigabyte';
import ASRock from './components/userspages/products/motherboard/asrock';
import ROGSeries from './components/userspages/products/motherboard/rog';

// GPU
import NVIDIA from './components/userspages/products/gpu/nvidia';
import AMDGraphics from './components/userspages/products/gpu/amd';
import INTELGraphics from './components/userspages/products/gpu/intel';

// Peripherals
import GamingMouse from './components/userspages/products/periperhals/gamingmouse';
import MechanicalKeyboard from './components/userspages/products/periperhals/mechanicalkb';
import Headsets from './components/userspages/products/periperhals/headset';
import Monitors from './components/userspages/products/periperhals/monitors';
import Webcams from './components/userspages/products/periperhals/webcams';

// Storage
import NVmeSSD from './components/userspages/products/storage/nvmessd';
import SataSSD from './components/userspages/products/storage/satassd';
import HDD from './components/userspages/products/storage/hdd';

// Category Pages
import ExternalStorage from './components/userspages/products/categories/externalssd';
import CPUCategory from './components/userspages/products/categories/cpucategories';
import MotherboardCategory from './components/userspages/products/categories/motherboardcategories';
import GraphicsCardCategory from './components/userspages/products/categories/graphicscardcategories';
import PeripheralsCategory from './components/userspages/products/categories/peripheralscategories';
import StorageCategory from './components/userspages/products/categories/storagecategories';

// Custom Build
import CustomPc from './components/userspages/products/custombuild/pccustom';
import PrebuiltPc from './components/userspages/products/custombuild/prebuilt';

function Appusers() {
  return (
    <Routes>
      <Route path="/"                         element={<Frontpage />} />
      <Route path="/pc-stores"                element={<Pcstores />} />
      <Route path="/ai-build"                 element={<Aibuild />} />
      <Route path="/components"               element={<Components />} />
      <Route path="/laptops"                  element={<Laptops />} />
      <Route path="/account"                  element={<Account />} />
      <Route path="/servers"                  element={<Servers />} />
      <Route path="/map"                      element={<Map />} />
      <Route path="/help"                     element={<Help />} />
      <Route path="/blog"                     element={<Blog />} />
      <Route path="/survey"                   element={<Survey />} />
      <Route path="/cart"                     element={<Cart />} />
      <Route path="/profile"                  element={<UserProfile />} />

      {/* CPU */}
      <Route path="/intel"                    element={<Intel />} />
      <Route path="/amd"                      element={<AMD />} />

      {/* Motherboard */}
      <Route path="/asus"                     element={<ASUS />} />
      <Route path="/msi"                      element={<MSI />} />
      <Route path="/gigabyte"                 element={<Gigabyte />} />
      <Route path="/asrock"                   element={<ASRock />} />
      <Route path="/rog-series"               element={<ROGSeries />} />

      {/* GPU */}
      <Route path="/nvidia"                   element={<NVIDIA />} />
      <Route path="/amd-graphics"             element={<AMDGraphics />} />
      <Route path="/intel-graphics"           element={<INTELGraphics />} />

      {/* Peripherals */}
      <Route path="/gaming-mouse"             element={<GamingMouse />} />
      <Route path="/mechanical-keyboard"      element={<MechanicalKeyboard />} />
      <Route path="/headsets"                 element={<Headsets />} />
      <Route path="/monitors"                 element={<Monitors />} />
      <Route path="/webcams"                  element={<Webcams />} />

      {/* Storage */}
      <Route path="/nvme-ssd"                 element={<NVmeSSD />} />
      <Route path="/sata-ssd"                 element={<SataSSD />} />
      <Route path="/hdd"                      element={<HDD />} />
      <Route path="/external-storage"         element={<ExternalStorage />} />

      {/* Categories */}
      <Route path="/category/cpu"             element={<CPUCategory />} />
      <Route path="/category/motherboard"     element={<MotherboardCategory />} />
      <Route path="/category/graphics-card"   element={<GraphicsCardCategory />} />
      <Route path="/category/peripherals"     element={<PeripheralsCategory />} />
      <Route path="/category/storage"         element={<StorageCategory />} />

      {/* Custom Build */}
      <Route path="/custom-pc-builds"         element={<CustomPc />} />
      <Route path="/pre-built-pcs"            element={<PrebuiltPc />} />
    </Routes>
  );
}

export default Appusers;