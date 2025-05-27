import AccountsPayable from '../models/accountsPayableModel.js';

const AccountsPayableService = {
    async validateReceiptsAndUpdateStatus(requestId) {
        const statuses = await AccountsPayable.getReceiptStatusesForRequest(requestId);

        if (statuses.includes('Rechazado')) {
            await AccountsPayable.updateRequestStatus(requestId, 6);
            return {
                updatedStatus: 6,
                message: 'Some receipts were rejected. Request moved back to step 6.'
            };
        }

        const allApproved = statuses.every(s => s === 'Aprobado');
        if (allApproved) {
            await AccountsPayable.updateRequestStatus(requestId, 8); // Finalizado
            return {
                updatedStatus: 8,
                message: 'All receipts approved. Request finalized.'
            };
        }

        return {
            updatedStatus: null,
            message: 'Receipts still pending. No status change applied.'
        };
    }
};

export default AccountsPayableService;