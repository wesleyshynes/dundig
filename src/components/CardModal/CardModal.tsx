import './cardModal.scss';

export default function CardModal(props: {
    active: boolean;
    onClose: () => void;
    children: any;
}) {
    const {
        active,
        onClose,
    } = props;


    if (!active) {
        return null;
    }

    return (
        <div className="card-modal-bg" onClick={(e: any) => {
            if (e.target.className.indexOf('card-modal-bg') === -1) {
                return
            }
            onClose()
        }}>
            <div className="card-modal">
                <button onClick={() => onClose()}>close</button>
                {props.children}
            </div>
        </div>
    )


}