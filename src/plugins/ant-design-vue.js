import Vue from 'vue';
import {
  Alert,
  Avatar,
  Badge,
  BackTop,
  Button,
  Card,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Icon,
  Input,
  Layout,
  List,
  LocaleProvider,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Radio,
  Select,
  Spin,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Upload,
  message,
} from 'ant-design-vue';

Vue.use(Alert);
Vue.use(Avatar);
Vue.use(Badge);
Vue.use(BackTop);
Vue.use(Button);
Vue.use(Card);
Vue.use(Checkbox);
Vue.use(Collapse);
Vue.use(ConfigProvider);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(Empty);
Vue.use(Form);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Layout);
Vue.use(List);
Vue.use(LocaleProvider);
Vue.use(Menu);
Vue.use(Modal);
Vue.use(Pagination);
Vue.use(Popconfirm);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Spin);
Vue.use(Switch);
Vue.use(Table);
Vue.use(Tabs);
Vue.use(Tooltip);
Vue.use(Upload);

Vue.prototype.$message = message;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
