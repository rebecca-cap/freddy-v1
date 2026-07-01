import { OrderEntryMetadataResponse, OrderEntryResponse, OrderUpsertResponse } from '@contexts/UserContext/types.schema'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eagerlyUpdateRowData } from '@utils/api'
import { cloneDeep } from 'lodash'

export const endpoints = {
  metadata: 'Admin/UserManagement/GetDataForUserManagement',
  getUsers: 'Admin/UserManagement/ReadUsers',
  createUpdateUser: 'Admin/UserManagement/CreateOrUpdateUsers',
  resetPassword: 'Admin/PasswordReset/ResetPassword',
  validatePassword: 'Admin/PasswordReset/ValidatePassword',
  validateOTP: 'Admin/PasswordReset/ValidateToken',
  changePasswordWithToken: 'Admin/PasswordReset/ChangePasswordWithToken',
}

export const useUsers = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery<OrderEntryMetadataResponse>([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const useUsersQuery = () =>
    useQuery<OrderEntryResponse>([endpoints.getUsers], () => api.post(endpoints.getUsers), {
      refetchOnWindowFocus: false,
    })

  const createUpdateUserMutation = useMutation(
    [endpoints.createUpdateUser],
    (user): Promise<OrderUpsertResponse> => {
      return api.post(endpoints.createUpdateUser, user)
    },
    {
      onMutate: async (newRow) => {
        const newRowCopy = cloneDeep(newRow[0])
        await queryClient.cancelQueries([endpoints.getUsers])
        eagerlyUpdateRowData(newRowCopy, endpoints.getUsers, 'ColleagueId', queryClient)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoints.getUsers])
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.getUsers], context)
      },
    }
  )

  const sendResetEmailRequest = useMutation(['sendResetEmailQuery'], (email: string) => {
    return api.post(endpoints.resetPassword, undefined, {
      queryParams: new URLSearchParams({ username: email }),
      ignoreDefaults: true,
    })
  })

  const validatePasswordRequest = useMutation(['validatePasswordRequest'], ({ password }: { password: string }) => {
    return api.post(endpoints.validatePassword, undefined, {
      queryParams: new URLSearchParams({ password }),
      ignoreDefaults: true,
    })
  })

  const validateOTPRequest = useMutation(['validateOTPRequest'], (oneTimePassword: string) => {
    return api.post(endpoints.validateOTP, undefined, {
      queryParams: new URLSearchParams({ urlData: oneTimePassword }),
      ignoreDefaults: true,
    })
  })

  const resetPasswordMutation = useMutation(
    ['resetPasswordMutation'],
    ({ oneTimePassword, newPassword }: { oneTimePassword: string; newPassword: string }) => {
      return api.post(
        endpoints.changePasswordWithToken,
        {
          PasswordResetToken: oneTimePassword,
          NewPassword: newPassword,
        },
        { ignoreDefaults: true }
      )
    }
  )

  return {
    useMetadataQuery,
    useUsersQuery,
    createUpdateUserMutation,
    sendResetEmailRequest,
    validatePasswordRequest,
    validateOTPRequest,
    resetPasswordMutation,
  }
}
