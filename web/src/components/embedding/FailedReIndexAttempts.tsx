import { buildCCPairInfoUrl } from "@/app/[locale]/admin/connector/[ccPairId]/lib";
import { PageSelector } from "@/components/PageSelector";
import { IndexAttemptStatus } from "@/components/Status";
import { deleteCCPair } from "@/lib/documentDeletion";
import {
  ConnectorIndexingStatus,
  FailedConnectorIndexingStatus,
} from "@/lib/types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import Link from "next/link";
import { useState } from "react";
import { FiLink, FiMaximize2, FiTrash, FiTrash2 } from "react-icons/fi";
import { mutate } from "swr";
import { PopupSpec } from "../admin/connectors/Popup";

export function FailedReIndexAttempts({
  failedIndexingStatuses,
  setPopup,
}: {
  failedIndexingStatuses: FailedConnectorIndexingStatus[];
  setPopup: (popupSpec: PopupSpec | null) => void;
}) {
  const numToDisplay = 10;
  const [page, setPage] = useState(1);

  const anyDeletable = failedIndexingStatuses.some(
    (status) => status.is_deletable
  );

  return (
    <div className="mt-6 mb-8 p-4 border border-red-300 rounded-lg bg-red-50">
      <Text className="text-red-700 font-semibold mb-2">
        Failed Re-indexing Attempts
      </Text>
      <Text className="text-red-600 mb-4">
        The table below shows only the failed re-indexing attempts for existing
        connectors. These failures require immediate attention. Once all
        connectors have been re-indexed successfully, the new model will be used
        for all search queries.
      </Text>

      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-1/8 sm:w-1/6">
                Connector Name
              </TableHeaderCell>
              <TableHeaderCell className="w-1/8 sm:w-1/6">
                Status
              </TableHeaderCell>
              <TableHeaderCell className="w-4/8 sm:w-2/6">
                Error Message
              </TableHeaderCell>
              <TableHeaderCell className="w-1/8 sm:w-1/6">
                Visit Connector
              </TableHeaderCell>
              {anyDeletable && (
                <TableHeaderCell className="w-1/8 sm:w-2/6">
                  Delete Connector
                </TableHeaderCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {failedIndexingStatuses
              .slice(numToDisplay * (page - 1), numToDisplay * page)
              .map((reindexingProgress) => {
                return (
                  <TableRow key={reindexingProgress.name}>
                    <TableCell>
                      <Link
                        href={`/admin/connector/${reindexingProgress.cc_pair_id}`}
                        className="text-link cursor-pointer flex"
                      >
                        <FiMaximize2 className="my-auto mr-1" />
                        {reindexingProgress.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IndexAttemptStatus status="failed" />
                    </TableCell>

                    <TableCell>
                      <div>
                        <Text className="flex flex-wrap whitespace-normal">
                          {reindexingProgress.error_msg || "-"}
                        </Text>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/connector/${reindexingProgress.cc_pair_id}`}
                        className="ctext-link cursor-pointer flex"
                      >
                        <FiLink className="my-auto mr-1" />
                        Visit Connector
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() =>
                          deleteCCPair(
                            reindexingProgress.connector_id,
                            reindexingProgress.credential_id,
                            setPopup,
                            () =>
                              mutate(
                                buildCCPairInfoUrl(
                                  reindexingProgress.cc_pair_id
                                )
                              )
                          )
                        }
                        icon={FiTrash}
                        disabled={reindexingProgress.is_deletable}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <div className="mt-3 flex">
          <div className="mx-auto">
            <PageSelector
              totalPages={Math.ceil(
                failedIndexingStatuses.length / numToDisplay
              )}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
