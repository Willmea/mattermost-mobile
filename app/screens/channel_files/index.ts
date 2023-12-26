// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {withDatabase, withObservables} from '@nozbe/watermelondb/react';
import {switchMap} from '@nozbe/watermelondb/utils/rx';
import {observeChannel} from '@queries/servers/channel';
import {observeCanDownloadFiles, observeConfigBooleanValue} from '@queries/servers/system';
import {of as of$} from 'rxjs';
import {observeCanDownloadFiles, observeConfigBooleanValue, observeCurrentTeamId} from '@queries/servers/system';

import ChannelFiles from './channel_files';

import type {WithDatabaseArgs} from '@typings/database/database';

type Props = WithDatabaseArgs & {
    channelId: string;
}

const enhance = withObservables(['channelId'], ({channelId, database}: Props) => {
    const channel = observeChannel(database, channelId);
    const teamId = channel.pipe(switchMap((c) => (c?.teamId ? of$(c.teamId) : observeCurrentTeamId(database))));
    return {
        channel,
        teamId,
        canDownloadFiles: observeCanDownloadFiles(database),
        publicLinkEnabled: observeConfigBooleanValue(database, 'EnablePublicLink'),
    };
});

export default withDatabase(enhance(ChannelFiles));
