import { Routes, Route } from 'react-router';

// User Pages
import Frontpage from './components/userspages/interactive/Frontpage';
import Pcstores from './components/userspages/interactive/pcstores';
import Aibuild from './components/userspages/interactive/aibuild';
import Networking from './components/userspages/interactive/networking';
import Laptops from './components/userspages/interactive/laptops';
import Account from './components/userspages/interactive/account';
import Servers from './components/userspages/interactive/servers';
import Map from './components/userspages/interactive/map';
import Help from './components/userspages/interactive/help';
import Blog from './components/userspages/interactive/blog';
import Survey from './components/userspages/interactive/survey';
import Cart from './components/userspages/interactive/cart';
import UserProfile from './components/userspages/interactive/userprofile';
import Login from './components/userspages/interactive/login'
import ForgotPassword from './components/userspages/interactive/forgotpassword';
import ResetPassword from './components/userspages/interactive/resetpassword';
import Register from './components/userspages/interactive/Register';
import Searchbar from './components/userspages/interactive/searchbar'
import SearchResults from './components/userspages/interactive/SearchResults';
import EcommerceBot from './components/userspages/interactive/ecommercebot';
import PCBuildViewer from './components/userspages/interactive/PCBuildViewer';
import ProductDetail from './components/userspages/interactive/ProductDetail'
import Checkout from './components/userspages/interactive/checkout'
import GigabyteLaptop from './components/userspages/products/laptops/gigabyte';
import Apple from './components/userspages/products/laptops/apple';
// CPU
import Intel from './components/userspages/products/cpu/intel';
{/*import AMD from './components/userspages/products/cpu/amd';*/}

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
      <Route path="/"  element={<Frontpage />} />
      <Route path="/pc-stores"  element={<Pcstores />} />
      <Route path="/ai-build"  element={<Aibuild />} />
      <Route path="/networking"  element={<Networking />} />
      <Route path="/laptops"  element={<Laptops />} />
      <Route path="/account"  element={<Account />} />
      <Route path="/servers"  element={<Servers />} />
      <Route path="/map"  element={<Map />} />
      <Route path="/help"  element={<Help />} />
      <Route path="/blog"  element={<Blog />} />
      <Route path="/survey"  element={<Survey />} />
      <Route path="/cart"  element={<Cart />} />
      <Route path="/profile"  element={<UserProfile />} />
      <Route path="/Login"  element={<Login/>} />
      <Route path="/login"  element={<Login/>} />
      <Route path="/ForgotPassword"  element={<ForgotPassword/>} />
      <Route path="/reset-password/:usid/:token" element={<ResetPassword />} />
      <Route path="/Register"  element={<Register/>}/>
      <Route path="/Searchbar" element={<Searchbar/>}/>
      <Route path="/search" element={<SearchResults/>}/>
      <Route path="/chatbot" element={<EcommerceBot/>}/>
      <Route path="/PCBuildViewer" element={<PCBuildViewer/>} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* CPU */}
      <Route path="/intel" element={<Intel />} />
      {/*<Route path="/amd"  element={<AMD />} />*/}

      {/* Motherboard */}
      <Route path="/asus" element={<ASUS />} />
      <Route path="/msi"  element={<MSI />} />
      <Route path="/gigabyte" element={<Gigabyte />} />
      <Route path="/asrock" element={<ASRock />} />
      <Route path="/rog-series" element={<ROGSeries />} />

      {/* GPU */}
      <Route path="/nvidia" element={<NVIDIA />} />
      <Route path="/amd-graphics" element={<AMDGraphics />} />
      <Route path="/intel-graphics" element={<INTELGraphics />} />

      {/* Peripherals */}
      <Route path="/gaming-mouse" element={<GamingMouse />} />
      <Route path="/mechanical-keyboard"  element={<MechanicalKeyboard />} />
      <Route path="/headsets" element={<Headsets />} />
      <Route path="/monitors" element={<Monitors />} />
      <Route path="/webcams"  element={<Webcams />} />

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

      {/* Laptops */}
      <Route path="/gigabyte" element={<GigabyteLaptop />} />
      <Route path="/laptops/gigabyte" element={<GigabyteLaptop />} />
      <Route path="/laptops/asus" element={<Laptops />} />
      <Route path="/laptops/lenovo" element={<Laptops />} />
      <Route path="/laptops/apple" element={<Apple />} />
    </Routes>
  );
}

export default Appusers;