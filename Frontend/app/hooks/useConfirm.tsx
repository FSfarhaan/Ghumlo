import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

type ConfirmOptions = {
  title: string;
  message: string;
};

export function useConfirm() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    message: "",
  });

  const [resolver, setResolver] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setVisible(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    setVisible(false);
    resolver?.(true);
  };

  const handleCancel = () => {
    setVisible(false);
    resolver?.(false);
  };

  const ConfirmUI = () => (
    <ConfirmModal
      visible={visible}
      title={options.title}
      message={options.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, ConfirmUI };
}
