import type { Library } from '../../conversion';
import type { Label } from './component/label';
import type { StringSelect } from './component/stringSelect';
import type { TextDisplay } from './component/textDisplay';
import type { TextInput } from './component/textInput';

type ModalComponent = TextInput | Label | StringSelect | TextDisplay;

export type APIModal = {
  custom_id: string;
  title: string;
  components: ModalComponent[];
};

export type Modal = Library<APIModal>;
