import type { ModalProps } from './types';

export const Modal = (props: ModalProps) => {
  const { isVisible, title, children } = props;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>

      {/* Content */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white p-4 sm:p-6 sm:pb-4">
              <div className="border-b pb-2 border-b-gray-300 sm:flex sm:items-start">
                <div className="text-center sm:text-left">
                  <h3
                    className="text-base font-semibold text-gray-900"
                    id="dialog-title"
                  >
                    {title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
